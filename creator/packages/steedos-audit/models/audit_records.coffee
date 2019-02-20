Creator.Objects.audit_records =
	name: "audit_records"
	label: "字段历史"
	icon: "record"
	fields:
		related_to:
			label: "相关项"
			type: "lookup"
			reference_to: ()->
				o = []
				_.each Creator.Objects, (object, object_name)->
					if object.enable_audit
						o.push object.name
				return o
			filterable:true
			is_name: true
		created:
			label:"时间"
			filterable:true
		field_name:
			label: "字段"
			type: "text"
			required: true
			is_wide: true
		created_by:
			label:"用户"
		previous_value:
			label: "原始值"
			type: "text"
		new_value:
			label: "新值"
			type: "text"


	list_views:
		all:
			label: "全部"
			filter_scope: "space"
			columns: ["related_to", "created", "field_name", "created_by", "previous_value", "new_value"]
			filter_fields: ["related_to"]
		recent:
			label: "最近查看"
			filter_scope: "space"

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
		admin:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true