Creator.Objects.forms =
	name: "forms"
	icon: "timesheet"
	label: "表单"
	fields:
		name:
			type: "text"
			label:"表单"
			required: true
			searchable: true
		state:
			type: "select"
			label:"表单状态"
			options: [{label: "启用",value: "enabled"},{label: "停用",value: "disabled"}]
		is_valid:
			type: "boolean"
			label:"是否有效"
		is_subform:
			type: "boolean"
			label:"申请单位"
		parent_form:
			label:"主表单"
			type: "text"
		current:
			label:"当前步骤"
			blackbox: true
			omit: true
		historys:
			label:"签核历程"	
			blackbox: true
			omit: true
		approve_on_create:
			label:"是否同意审批"
			type: "boolean"
		approve_on_modify:
			label:"是否修改审批"
			type: "boolean"
		approve_on_delete:
			type: "boolean"
			label:"是否删除审批"
		enable_workflow:
			type: "boolean"
			label:"是否启用工作流"
		enable_view_others:
			type: "boolean"
			label:"是否查看其它表单"
		app:
			label:"所属应用"
			type: "text"
			omit: true
		description:
			type: "textarea"
			label:"表单描述"
			
	list_views:
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