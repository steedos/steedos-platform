Creator.Objects.notes = 
	name: "notes"
	label: "备注"
	icon: "messaging_conversation"
	fields:
		name: 
			label: "标题"
			type: "text"
			required: true
			is_wide: true
			searchable:true
			index:true
		description: 
			label: "内容"
			type: "textarea"
			is_wide: true
			searchable:true
			index:true
		related_to:
			label: "相关项"
			type: "lookup"
			reference_to: ()->
				o = []
				_.each Creator.Objects, (object, object_name)->
					if object.enable_notes
						o.push object_name
				return o 

	list_views:
		default:
			columns: ["name", "owner", "created"]
		recent:
			label: "最近查看"
			filter_scope: "space"
		mine:
			label: "我的备注"
			filter_scope: "space"
			filters: [["owner", "=", "{userId}"]]
		all:
			label: "所有备注"
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: true
			allowDelete: true
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