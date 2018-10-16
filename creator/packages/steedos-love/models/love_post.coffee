Creator.Objects.love_post =
	name: "love_post"
	label: "交友动态"
	icon: "contract"
	enable_files:true
	fields:
		name:
			label:'标题'
			type:'text'
			required:true
			is_wide:true
		description:
			label:'正文'
			is_wide:true
			type:'markdown'
			rows: 8
		images:
			label: '图片'
			type: 'image'
			multiple : true
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
	list_views:
		all:
			label: "所有"
			columns: ["name", "images"]
			filter_scope: "space"

	triggers:
		"before.insert.server.post":
			on: "server"
			when: "before.insert"
			todo: (userId, doc)->

		"before.update.server.post":
			on: "server"
			when: "before.update"
			todo: (userId, doc, fieldNames, modifier, options)->

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
			modifyAllRecords: false
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