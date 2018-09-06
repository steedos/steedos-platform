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
		images:
			label: '图片'
			type: 'image'
			multiple : true			
		# featured:
		# 	label:'推荐'
		# 	type:'boolean'
		# 	index:true
		# 	group:'-'
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
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: true
			allowDelete: true
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		guest:
			allowCreate: true
			allowDelete: true
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		member:
			allowCreate: true
			allowDelete: true
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true