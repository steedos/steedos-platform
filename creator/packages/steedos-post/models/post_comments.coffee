Creator.Objects.post_comments =
	name: "post_comments"
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
			reference_to:'post'
			index:true
	triggers:
		"after.insert.server.post_comments":
			on: "server"
			when: "after.insert"
			todo: (userId, doc)->
				if doc.name and doc.post_id
					obj = Creator.getCollection("post").findOne({_id: doc.post_id})
					if obj._id
						comment_count = obj.comment_count || 0
						comment_count++
						Creator.getCollection("post").direct.update({_id: doc.post_id}, {$set: {comment_count: comment_count}})
	list_views:
		all:
			label: "所有"
			columns: ["created_by","content", "created"]
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
