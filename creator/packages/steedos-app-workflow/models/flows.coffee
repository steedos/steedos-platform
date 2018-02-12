Creator.Objects.flows =
	name: "flows"
	icon: "timesheet"
	label: "flows"
	fields:
		name:
			type: "text"
			required: true
			searchable: true
		form:
			type: "text"
		flowtype:
			type: "text"
		name_formula:
			type: "text"
		code_formula:
			type: "text"
		description:
			type: "text"
		is_valid:
			type: "boolean"
		state:
			type: "select"
			options: [{label: "启用",value: "enabled"},{label: "停用",value: "disabled"}]
		help_text:
			type: "text"
		current_no:
			type: "number"
		current:
			blackbox: true
		perms:
			blackbox: true
		app:
			type: "text"
		historys:
			blackbox: true
		auto_remind:
			type: "boolean"
		instance_template:
			type: "textarea"
			is_wide: true
			rows: 6
		print_template:
			type: "textarea"
			rows: 6
			is_wide: true
		field_map:
			type: "textarea"
			rows: 6
			is_wide: true
		events:
			type: "textarea"
			rows: 6
			is_wide: true
		distribute_optional_users:
			type: "lookup"
			reference_to: "users"
			multiple: true
			is_wide: true
		distribute_to_self:
			type: "boolean"

	list_views:
		default:
			columns: ["name", "modified", "modified_by", "auto_remind"]
			extra_columns: ["instance_template", "print_template", "field_map", "events", "distribute_optional_users"]
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

	actions:
		edit_template:
			label: "设置模板"
			visible: true
			on: "record"
			todo: (object_name, record_id, fields)->
				Session.set 'cmDoc', Creator.getCollection(object_name).findOne(record_id)
				Session.set 'action_fields', 'instance_template,print_template'
				Meteor.defer ()->
					$(".creator-edit").click()

		edit_events:
			label: "设置脚本"
			visible: true
			on: "record"
			todo: (object_name, record_id, fields)->
				Session.set 'cmDoc', Creator.getCollection(object_name).findOne(record_id)
				Session.set 'action_fields', 'events'
				Meteor.defer ()->
					$(".creator-edit").click()

		edit_field_map:
			label: "设置归档关系"
			visible: true
			on: "record"
			todo: (object_name, record_id, fields)->
				Session.set 'cmDoc', Creator.getCollection(object_name).findOne(record_id)
				Session.set 'action_fields', 'field_map'
				Meteor.defer ()->
					$(".creator-edit").click()
		edit_distribute:
			label: "设置分发"
			visible: true
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
			modifyAllRecords: false
			viewAllRecords: true

console.log "Creator.Apps.admin", Creator.Apps.admin
Creator.Apps.admin?.objects.push "flows"