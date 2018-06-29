Creator.Objects.flows =
	name: "flows"
	icon: "timesheet"
	label: "流程"
	fields:
		name:
			type: "text"
			label:"流程名"
			required: true
			searchable: true
			readonly: true
		form:
			label:"流程表单"
			type: "master_detail"
			reference_to: "forms"
			readonly: true
		flowtype:
			label:"流程分类"
			type: "text"
			omit: true
			hidden: true
		state:
			label:"流程状态"
			type: "select"
			options: [{label: "启用",value: "enabled"},{label: "停用",value: "disabled"}]
		is_valid:
			label:"流程是否有效"
			type: "boolean"
		description:
			label:"流程介绍"
			type: "textarea"
		help_text:
			label:"流程帮助"
			type: "text"
		current_no:
			label:"流程编号"
			type: "number"
		current:
			blackbox: true
			omit: true
			hidden: true
			label:"当前版本"
		perms:
			label:"流程权限"
			type: 'Object'
			is_wide: true

		"perms.users_can_add":
			label:"授权用户: 新建申请单"
			type: "lookup"
			reference_to: "users"
			multiple: true
		"perms.orgs_can_add":
			label:"授权部门: 新建申请单"
			type: "lookup"
			reference_to: "organizations"
			multiple: true

		"perms.users_can_monitor":
			label:"授权用户: 查看所有申请单"
			type: "lookup"
			reference_to: "users"
			multiple: true
		"perms.orgs_can_monitor":
			label:"授权部门: 查看所有申请单"
			type: "lookup"
			reference_to: "organizations"
			multiple: true

		"perms.users_can_admin":
			label:"授权用户: 查看所有申请单，并能执行重定位、转签核、删除操作"
			type: "lookup"
			reference_to: "users"
			multiple: true
		"perms.orgs_can_admin":
			label:"授权部门: 查看所有申请单，并能执行重定位、转签核、删除操作"
			type: "lookup"
			reference_to: "organizations"
			multiple: true

		app:
			label:"所属应用"
			type: "text"
			omit: true
		historys:
			label:"历史版本"
			blackbox: true
			omit: true
			hidden: true
		name_formula:
			label:"标题公式"
			type: "text"
			group: "高级"
		code_formula:
			label:"系统公式"
			type: "text"
			group: "高级"
		auto_remind:
			label:"自动催办"
			type: "boolean"
			group: "高级"
		instance_template:
			label:"表单模板"
			type: "textarea"
			is_wide: true
			rows: 6
			group: "高级"
		print_template:
			label:"打印模板"
			type: "textarea"
			rows: 6
			is_wide: true
			group: "高级"
		field_map:
			label:"映射关系"
			type: "textarea"
			rows: 6
			is_wide: true
			group: "高级"
		events:
			label:"相关事件"
			type: "textarea"
			rows: 6
			is_wide: true
			group: "高级"
		distribute_optional_users:
			type: "lookup"
			label: "分发者"
			reference_to: "users"
			multiple: true
			is_wide: true
			group: "高级"
		distribute_to_self:
			label:"分发给自己"
			type: "boolean"
			group: "高级"

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
#			extra_columns: ["instance_template", "print_template", "field_map", "events", "distribute_optional_users", "perms"]
			columns: ["name", "modified", "modified_by", "auto_remind", "state", "is_deleted"]
		is_deleted:
			label: "已删除"
			columns: ["name", "modified", "modified_by"]
			filter_scope: "space"
			filters: [["is_deleted", "=", true]]

	actions:
		standard_edit:
			visible: false
			on: "record"
		standard_delete:
			visible: false
			on: "record_more"
		edit_template:
			label: "设置模板"
			visible: (object_name, record_id, record_permissions)->
				if FlowRouter.current().params?.record_id
					return true && record_permissions["allowEdit"]
				return false
			on: "record"
			todo: (object_name, record_id, fields)->
				Session.set 'cmDoc', Creator.getCollection(object_name).findOne(record_id)
				Session.set 'action_fields', 'instance_template,print_template'
				Meteor.defer ()->
					$(".creator-edit").click()
		edit_perms:
			label: "设置权限"
			visible: (object_name, record_id, record_permissions)->
				if FlowRouter.current().params?.record_id
					return true && record_permissions["allowEdit"]
				return false
			on: "record"
			todo: (object_name, record_id, fields)->
				console.log('edit_perms', object_name, record_id)
				Session.set 'cmDoc', Creator.getCollection(object_name).findOne(record_id)
				Session.set 'action_fields', 'perms, perms.orgs_can_add, perms.users_can_add, perms.orgs_can_monitor, perms.users_can_monitor, perms.orgs_can_admin, perms.users_can_admin'
				Meteor.defer ()->
					$(".creator-edit").click()

		edit_events:
			label: "设置脚本"
			visible: (object_name, record_id, record_permissions)->
				if FlowRouter.current().params?.record_id
					return true && record_permissions["allowEdit"]
				return false
			on: "record"
			todo: (object_name, record_id, fields)->
				Session.set 'cmDoc', Creator.getCollection(object_name).findOne(record_id)
				Session.set 'action_fields', 'events'
				Meteor.defer ()->
					$(".creator-edit").click()

		edit_field_map:
			label: "设置归档关系"
			visible: (object_name, record_id, record_permissions)->
				if FlowRouter.current().params?.record_id
					return true && record_permissions["allowEdit"]
				return false
			on: "record"
			todo: (object_name, record_id, fields)->
				Session.set 'cmDoc', Creator.getCollection(object_name).findOne(record_id)
				Session.set 'action_fields', 'field_map'
				Meteor.defer ()->
					$(".creator-edit").click()
		edit_distribute:
			label: "设置分发"
			visible: (object_name, record_id, record_permissions)->
				if FlowRouter.current().params?.record_id
					return true && record_permissions["allowEdit"]
				return false
			on: "record"
			todo: (object_name, record_id, fields)->
				Session.set 'cmDoc', Creator.getCollection(object_name).findOne(record_id)
				Session.set 'action_fields', 'distribute_optional_users,distribute_to_self'
				Meteor.defer ()->
					$(".creator-edit").click()


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
			modifyAllRecords: true
			viewAllRecords: true
