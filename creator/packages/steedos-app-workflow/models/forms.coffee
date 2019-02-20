db.forms = new Meteor.Collection('forms')

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
			readonly: true
		state:
			type: "select"
			label:"表单状态"
			options: [{label: "启用",value: "enabled"},{label: "停用",value: "disabled"}]
			readonly: true

		description:
			type: "textarea"
			label:"表单描述"
			is_wide: true

		category:
			type: "lookup"
			label: "表单分类"
			reference_to: "categories"
			readonly: true
		is_valid:
			type: "boolean"
			label:"是否有效"
			readonly: true

		historys:
			label:"历史版本"
			blackbox: true
			omit: true
			hidden: true

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

		current:
			label:"当前版本"
			type: 'Object'
			is_wide: true
			readonly: true
			blackbox: true

		'current.form_script':
			label: "表单脚本"
			type: 'code'
			readonly: true
		'current.name_forumla':
			label: "标题公式"
			type: 'code'
			readonly: true

		'current.fields':
			label: "字段"
			type: 'grid'
			is_wide: true
			readonly: true
		'current.fields.$.code':
			label: "名称"
			type: 'text'
			readonly: true
		'current.fields.$.name':
			label: "显示名"
			type: 'text'
			readonly: true
		'current.fields.$.type':
			label: "类型"
			type: 'select'
			options: "勾选框:checkbox,日期-时间:dateTime,日期:date,邮件:email,选择部门:group,文本:input,多选:multiSelect,数值:number,密码:password,单选:radio,分组:section,下拉框:select,表格:table,网址:url,选择用户:user,地理位置:geolocation"
			readonly: true
		'current.fields.$.is_required':
			label: '必填'
			type: 'boolean'
			readonly: true
		'current.fields.$.is_wide':
			label: "宽字段"
			type: 'boolean'
			readonly: true
		'current.fields.$.is_list_display':
			label: "列表显示"
			type: 'boolean'
			readonly: true
		'current.fields.$.is_searchable':
			label: "可搜索"
			type: 'boolean'
			readonly: true
		'current.fields.$.is_multiselect':
			label: "多选"
			type: 'boolean'
			readonly: true

		company_id:
			required: Meteor.settings?.public?.is_group_company
			omit: false
			hidden: false

	list_views:
		all:
			label: "所有"
			filter_scope: "space"
			filters: [["is_deleted", "=", false]]
			columns: ["name", "category", "modified", "modified_by", "auto_remind", "state"]

	actions:
		standard_new:
			visible: false
			on: "list"
		standard_edit:
			visible: false
			on: "record"
		standard_delete:
			visible: false
			on: "record_more"

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
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true
		workflow_admin:
			allowCreate: false
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
			modifyCompanyRecords: true
			viewCompanyRecords: true
			disabled_list_views: []
			disabled_actions: []
			unreadable_fields: []
			uneditable_fields: []
			unrelated_objects: []

if Meteor.isServer

	db.forms.before.insert (userId, doc) ->
		doc.created_by = userId;
		doc.created = new Date();
		if doc.current
			doc.current.created_by = userId;
			doc.current.created = new Date();
			doc.current.modified_by = userId;
			doc.current.modified = new Date();

	db.forms.before.update (userId, doc, fieldNames, modifier, options) ->

		modifier.$set = modifier.$set || {};

		modifier.$set.modified_by = userId;
		modifier.$set.modified = new Date();

	db.forms._ensureIndex({
		"is_deleted": 1
	},{background: true})

	db.forms._ensureIndex({
		"space": 1
	},{background: true})

	db.forms._ensureIndex({
		"space": 1,
		"is_deleted": 1
	},{background: true})

	db.forms._ensureIndex({
		"space": 1,
		"app": 1,
		"created": 1
	},{background: true})

	db.forms._ensureIndex({
		"space": 1,
		"app": 1,
		"created": 1,
		"current.modified": 1
	},{background: true})

	db.forms._ensureIndex({
		"name": 1,
		"space": 1
	},{background: true})

	db.forms._ensureIndex({
		"_id": 1,
		"space": 1
	},{background: true})

	db.forms._ensureIndex({
		"space": 1,
		"state": 1
	},{background: true})
