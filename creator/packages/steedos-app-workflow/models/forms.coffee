Creator.Objects.forms =
	name: "forms"
	icon: "timesheet"
	label: "表单"
	fields:
		name:
			type: "text"
			required: true
			searchable: true
		state:
			type: "select"
			options: [{label: "启用",value: "enabled"},{label: "停用",value: "disabled"}]
		is_valid:
			type: "boolean"
		is_subform:
			type: "boolean"
		parent_form:
			type: "text"
		current:
			blackbox: true
			omit: true
		historys:
			blackbox: true
			omit: true
		approve_on_create:
			type: "boolean"
		approve_on_modify:
			type: "boolean"
		approve_on_delete:
			type: "boolean"
		enable_workflow:
			type: "boolean"
		enable_view_others:
			type: "boolean"
		app:
			type: "text"
			omit: true
		description:
			type: "textarea"
	list_views:
		default:
			columns: ["name", "modified", "modified_by"]
		enabled:
			label: "已启用"
			filter_scope: "space"
			filters: [["is_deleted", "=", false], ["state", "=", "enabled"]]
		disabled:
			label: "已停用"
			filter_scope: "space"
			filters: [["is_deleted", "=", false], ["state", "=", "disabled"]]
		all:
			label: "全部"
			filter_scope: "space"
			columns: ["name", "modified", "modified_by", "auto_remind", "state", "is_deleted"]
		is_deleted:
			label: "已删除"
			columns: ["name", "modified", "modified_by"]
			filter_scope: "space"
			filters: [["is_deleted", "=", true]]


	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true
		admin:
			allowCreate: false
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: true