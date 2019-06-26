db.flows = new Meteor.Collection('flows')

if Meteor.isServer
	db.flows.copy = (userId, spaceId, flowId, options, enabled)->

		flow = db.flows.findOne({_id: flowId, space: spaceId}, {fields: {_id: 1, name: 1, form: 1}})

		if !flow
			throw Meteor.Error("[flow.copy]未找到flow, space: #{spaceId}, flowId: #{flowId}");

		newFlowName = options?.name
		company_id = options?.company_id

		if newFlowName
			newName = newFlowName
		else
			newName = "复制:" + flow.name

		form = steedosExport.form(flow.form, flow._id, true, company_id)

		if _.isEmpty(form)
			throw Meteor.Error("[flow.copy]未找到form, formId: #{flow.form}");

		form.name = newName

		form.flows?.forEach (f)->
			f.name = newName

		steedosImport.workflow(userId, spaceId, form, enabled, company_id)

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
			type: "lookup"
			reference_to: "forms"
			readonly: true
		category:
			label: '流程分类'
			type: "lookup"
			reference_to: "categories"
		state:
			label:"流程状态"
			type: "select"
			options: [{label: "启用",value: "enabled"},{label: "停用",value: "disabled"}]
			readonly: true
		is_valid:
			label:"流程有效"
			type: "boolean"
			readonly: true
		current_no:
			label:"当前序号"
			type: "number"
			readonly: true
		description:
			label:"备注"
			type: "textarea"
			is_wide: true
		help_text:
			label:"帮助文本"
			type: "textarea"
			is_wide: true
		company_id:
			required: Meteor.settings?.public?.is_group_company
			omit: false
			hidden: false
		created_by:
			label:"创建人"
		modified_by:
			label:"修改人"
		current:
#			omit: true
#			hidden: true
			label:"步骤"
			type: 'Object'
			is_wide: true
			blackbox: true
#		'current._id':
#			type: 'text'
#			readonly: true
#			omit: true
#			hidden: true
#		'current._rev':
#			label: '版本号'
#			type: 'text'
#			readonly: true
#		'current.flow':
#			type: 'text'
#			readonly: true
#			omit: true
#			hidden: true
#		'current.form_version':
#			type: 'text'
#			readonly: true
#			omit: true
#			hidden: true
		'current.modified':
			label: "修改时间"
			type: 'datetime'
			readonly: true
			omit: true
			hidden: true
		'current.modified_by':
			label: "修改人"
			type: "lookup"
			reference_to: "users"
			readonly: true
			omit: true
			hidden: true
		'current.created':
			label: "创建时间"
			type: 'datetime'
			readonly: true
			omit: true
			hidden: true
		'current.created_by':
			label: "创建人"
			type: "lookup"
			reference_to: "users"
			readonly: true
			omit: true
			hidden: true
		'current.steps':
			label: "步骤"
			type: "grid"
			readonly: true
			is_wide: true
		'current.steps.$._id':
			type: "text"
			omit: true
			readonly: true
			hidden: true
		'current.steps.$.name':
			label: "名称"
			readonly: true
			type: "text"
		'current.steps.$.disableCC':
			label: "禁止传阅"
			type: "boolean"
			readonly: true
		'current.steps.$.allowDistribute':
			label: "允许分发"
			type: "boolean"
			readonly: true
		'current.steps.$.can_edit_main_attach':
			label: "允许修改正文"
			type: "boolean"
			readonly: true
		'current.steps.$.can_edit_normal_attach':
			label: "允许修改附件"
			type: "boolean"
			readonly: true
		'current.steps.$.distribute_optional_flows':
			label: "此步骤分发时可选的流程范围"
			type: "lookup"
			reference_to: "flows"
			multiple: true
			omit: true
			hidden: true
		'current.steps.$.cc_must_finished':
			label: "必须等待传阅完成"
			type: "boolean"
			readonly: true
		'current.steps.$.cc_alert':
			label: "弹出传阅提醒"
			type: "boolean"
			readonly: true
		'current.steps.$.allowBatch':
			label: "批量审批"
			type: "boolean"
			readonly: true
		'current.steps.$.oneClickApproval':
			label: "一键核准"
			type: "boolean"
			readonly: true
		'current.steps.$.oneClickRejection':
			label: "一键驳回"
			type: "boolean"
			readonly: true

		perms:
			label:"权限"
			type: 'Object'
			is_wide: true
			blackbox: true

		"perms.users_can_add":
			label:"授权用户: 新建申请单"
			type: "lookup"
			reference_to: "users"
			multiple: true
			is_wide: true
		"perms.orgs_can_add":
			label:"授权部门: 新建申请单"
			type: "lookup"
			reference_to: "organizations"
			multiple: true
			is_wide: true

		"perms.users_can_monitor":
			label:"授权用户: 查看所有申请单"
			type: "lookup"
			reference_to: "users"
			multiple: true
			is_wide: true
		"perms.orgs_can_monitor":
			label:"授权部门: 查看所有申请单"
			type: "lookup"
			reference_to: "organizations"
			multiple: true
			is_wide: true

		"perms.users_can_admin":
			label:"授权用户: 查看所有申请单，并能执行重定位、转签核、删除操作"
			type: "lookup"
			reference_to: "users"
			multiple: true
			is_wide: true
		"perms.orgs_can_admin":
			label:"授权部门: 查看所有申请单，并能执行重定位、转签核、删除操作"
			type: "lookup"
			reference_to: "organizations"
			multiple: true
			is_wide: true

		app:
			label:"所属应用"
			type: "text"
			omit: true
			hidden: true
		historys:
			label:"历史版本"
			blackbox: true
			omit: true
			hidden: true
		instance_template:
			label:"表单模板"
			type: "code",
			language: "handlebars",
			is_wide: true
			group: "模板"
		print_template:
			label:"打印模板"
			type: "code",
			language: "handlebars",
			is_wide: true
			group: "模板"
		field_map:
			label:"映射关系"
			type: "textarea"
			is_wide: true
			group: "归档"
		events:
			label:"相关事件"
			type: "textarea"
			is_wide: true
			group: "脚本"
		distribute_optional_users:
			type: "lookup"
			label: "流程被分发时分发对象选择范围"
			reference_to: "users"
			multiple: true
			is_wide: true
			group: "分发"
			blackbox: true
			omit: true
			hidden: true
		distribute_to_self:
			label:"分发给自己"
			type: "boolean"
			group: "分发"
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
		sort_no:
			type: "number"
			label:'排序号'
			group:'高级'
			sortable: true
		timeout_auto_submit:
			label:"超时自动流转"
			type: "boolean"
			group: "高级"
	list_views:
		# enabled:
		# 	label: "已启用"
		# 	filter_scope: "space"
		# 	filters: [["is_deleted", "=", false], ["state", "=", "enabled"]]
		# disabled:
		# 	label: "已停用"
		# 	filter_scope: "space"
		# 	filters: [["is_deleted", "=", false], ["state", "=", "disabled"]]
		all:
			label: "所有"
			filter_scope: "space"
#			extra_columns: ["instance_template", "print_template", "field_map", "events", "distribute_optional_users", "perms"]
			columns: ["name", "modified", "modified_by", "auto_remind", "state", "is_deleted", "company_id", "form", "sort_no"]
			sort: [["sort_no", "desc"],["modified", "desc"]]

	actions:
		# standard_query:
		# 	label: "查找"
		# 	visible: false
		# 	on: "list"
		# 	todo: "standard_query"

		standard_new:
			label: "新建"
			visible: ()->
				permissions = Creator.getPermissions()
				if permissions
					return permissions["allowCreate"]
			on: "list"
			todo: (object_name, record_id, fields)->
				Modal.show('new_flow_modal')
		design:
			label: "流程设计器"
			visible: ()->
				return true;
			on: "list"
			todo: (object_name, record_id, fields)->
				WorkflowCore.openFlowDesign(Steedos.locale(), Steedos.spaceId(), null, Creator.getUserCompanyId())
		standard_edit:
			visible: false
			on: "record"
		standard_delete:
			visible: false
			on: "record_more"
		# edit_template:
		# 	label: "设置模板"
		# 	visible: (object_name, record_id, record_permissions)->
		# 		if FlowRouter.current().params?.record_id
		# 			return true && record_permissions["allowEdit"]
		# 		return false
		# 	on: "record"
		# 	todo: (object_name, record_id, fields)->
		# 		Session.set 'cmDoc', Creator.getCollection(object_name).findOne(record_id)
		# 		Session.set 'action_fields', 'instance_template,print_template'
		# 		Meteor.defer ()->
		# 			$(".creator-edit").click()
		# edit_perms:
		# 	label: "设置权限"
		# 	visible: (object_name, record_id, record_permissions)->
		# 		if FlowRouter.current().params?.record_id
		# 			return true && record_permissions["allowEdit"]
		# 		return false
		# 	on: "record"
		# 	todo: (object_name, record_id, fields)->
		# 		console.log('edit_perms', object_name, record_id)
		# 		Session.set 'cmDoc', Creator.getCollection(object_name).findOne(record_id)
		# 		Session.set 'action_fields', 'perms, perms.orgs_can_add, perms.users_can_add, perms.orgs_can_monitor, perms.users_can_monitor, perms.orgs_can_admin, perms.users_can_admin'
		# 		Meteor.defer ()->
		# 			$(".creator-edit").click()

		# edit_events:
		# 	label: "设置脚本"
		# 	visible: (object_name, record_id, record_permissions)->
		# 		if FlowRouter.current().params?.record_id
		# 			return true && record_permissions["allowEdit"]
		# 		return false
		# 	on: "record"
		# 	todo: (object_name, record_id, fields)->
		# 		Session.set 'cmDoc', Creator.getCollection(object_name).findOne(record_id)
		# 		Session.set 'action_fields', 'events'
		# 		Meteor.defer ()->
		# 			$(".creator-edit").click()

		# edit_field_map:
		# 	label: "设置归档关系"
		# 	visible: (object_name, record_id, record_permissions)->
		# 		if FlowRouter.current().params?.record_id
		# 			return true && record_permissions["allowEdit"]
		# 		return false
		# 	on: "record"
		# 	todo: (object_name, record_id, fields)->
		# 		Session.set 'cmDoc', Creator.getCollection(object_name).findOne(record_id)
		# 		Session.set 'action_fields', 'field_map'
		# 		Meteor.defer ()->
		# 			$(".creator-edit").click()
		# edit_distribute:
		# 	label: "设置分发"
		# 	visible: (object_name, record_id, record_permissions)->
		# 		if FlowRouter.current().params?.record_id
		# 			return true && record_permissions["allowEdit"]
		# 		return false
		# 	on: "record"
		# 	todo: (object_name, record_id, fields)->
		# 		Session.set 'cmDoc', Creator.getCollection(object_name).findOne(record_id)
		# 		Session.set 'action_fields', 'distribute_optional_users,distribute_to_self'
		# 		Meteor.defer ()->
		# 			$(".creator-edit").click()

		designFlow:
			label: "流程设计器"
			visible: (object_name, record_id, record_permissions)->
				return true;
			on: "record"
			todo: (object_name, record_id, fields)->
				WorkflowCore.openFlowDesign(Steedos.locale(), Steedos.spaceId(), record_id, Creator.getUserCompanyId())
		designForm:
			label: "表单设计器"
			visible: (object_name, record_id, record_permissions)->
				return true;
			on: "record"
			todo: (object_name, record_id, fields)->
				WorkflowCore.openFormDesign(Steedos.locale(), Steedos.spaceId(), this.record.form, Creator.getUserCompanyId())

#		edit_steps:
#			label: "设置步骤"
#			visible: (object_name, record_id, record_permissions)->
#				if FlowRouter.current().params?.record_id
#					return true && record_permissions["allowEdit"]
#				return false
#			on: "record"
#			todo: (object_name, record_id, fields)->
#				console.log('edit_steps', object_name, record_id)
#				Session.set 'cmDoc', Creator.getCollection(object_name).findOne(record_id)
#				Session.set 'action_fields', 'current,current._rev,current.steps'
#				Meteor.defer ()->
#					$(".creator-edit").click()
		exportFlow:
			label: "导出流程"
			visible: true
			on: "record"
			todo: (object_name, record_id, fields)->
				console.log("exportFlow", object_name, record_id, fields);
				if _.isString(this.record?.form)
					form_id = this.record.form
				else if this.record?.form?._id
					form_id = this.record.form._id
				if form_id
					window.open("/api/workflow/export/form?form=#{form_id}", '_blank')
				else
					flow = Creator.getCollection(object_name).findOne(record_id)
					if flow
						window.open("/api/workflow/export/form?form=#{flow.form}", '_blank')
		importFlow:
			label: "导入流程"
			visible: true
			on: "list"
			todo: ()->
				Modal.show "admin_import_flow_modal", {
					onSuccess: (flows)->
						if flows.length > 0
							FlowRouter.go("/app/admin/flows/view/#{flows[0]}")
				}
		copyFlow:
			label: "复制流程"
			visible: true
			on: "record"
			todo: (object_name, record_id, fields)->
				Modal.show "copy_flow_modal", {
					record_id: record_id,
					onSuccess: (flows)->
						if flows.length > 0
							FlowRouter.go("/app/admin/flows/view/#{flows[0]}")
				}
		distributeAdmin:
			label: "设置分发"
			visible: true
			on: "record"
			todo: (object_name, record_id, fields)->
				Modal.show("distribute_edit_flow_modal", { flow: this.record })

	permission_set:
		user:
			allowCreate: false
			allowDelete: false
			allowEdit: false
			allowRead: true
			modifyAllRecords: false
			viewAllRecords: false
		admin:
			allowCreate: true
			allowDelete: false
			allowEdit: true
			allowRead: true
			modifyAllRecords: true
			viewAllRecords: true
		workflow_admin:
			allowCreate: true
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
	db.flows.allow
		insert: (userId, event) ->
			return false

		update: (userId, event) ->
			if (!Steedos.isSpaceAdmin(event.space, userId))
				return false
			else
				return true

		remove: (userId, event) ->
			return false

	db.flows.before.insert (userId, doc) ->
		doc.created_by = userId;
		doc.created = new Date();
		if doc.current
			doc.current.created_by = userId;
			doc.current.created = new Date();
			doc.current.modified_by = userId;
			doc.current.modified = new Date();

	db.flows.after.update (userId, doc, fieldNames, modifier, options) ->
		modifier.$set = modifier.$set || {};

		if !modifier.$set.current
			if _.keys(modifier.$set).toString() isnt 'auto_remind' and _.keys(modifier.$set).toString() isnt 'upload_after_being_distributed' # 为了启用自动催办的时候流程在列表位置不变
				modifier.$set['current.modified_by'] = userId;
				modifier.$set['current.modified'] = new Date();

		if (!Steedos.isLegalVersion(doc.space,"workflow.professional"))
			throw new Meteor.Error(400, "space_paid_info_title");

		if doc.category != this.previous.category
			if doc.category
				db.forms.update(doc.form, { $set: { category: doc.category } })
			else
				db.forms.update(doc.form, { $unset: { category: 1 } })

		if doc.company_id != this.previous.company_id
			if doc.company_id
				db.forms.update(doc.form, { $set: { company_id: doc.company_id } })
			else
				db.forms.update(doc.form, { $unset: { company_id: 1 } })

	db.flows._ensureIndex({
		"is_deleted": 1
	},{background: true})

	db.flows._ensureIndex({
		"space": 1
	},{background: true})

	db.flows._ensureIndex({
		"space": 1,
		"is_deleted": 1
	},{background: true})

	db.flows._ensureIndex({
		"role": 1,
		"is_deleted": 1
	},{background: true})

	db.flows._ensureIndex({
		"space": 1,
		"app": 1,
		"created": 1
	},{background: true})

	db.flows._ensureIndex({
		"space": 1,
		"app": 1,
		"created": 1,
		"current.modified": 1
	},{background: true})

	db.flows._ensureIndex({
		"name": 1,
		"space": 1
	},{background: true})

	db.flows._ensureIndex({
		"form": 1,
		"is_deleted": 1
	},{background: true})

	db.flows._ensureIndex({
		"current.steps.approver_roles": 1,
		"space": 1,
		"is_deleted": 1
	},{background: true})

	db.flows._ensureIndex({
		"_id": 1,
		"space": 1,
		"is_deleted": 1
	},{background: true})

	db.flows._ensureIndex({
		"space": 1,
		"form": 1
	},{background: true})

	db.flows._ensureIndex({
		"form": 1
	},{background: true})

	db.flows._ensureIndex({
		"space": 1,
		"form": 1,
		"state:": 1
	},{background: true})


db.flows.helpers
	modified_by_name: () ->
		spaceUser = db.space_users.findOne({user: this.current?.modified_by}, {fields: {name: 1}});
		return spaceUser?.name;

	category_name: ()->
		form = db.forms.findOne({_id: this.form, space: this.space});

		if form && form.category
			category = db.categories.findOne({_id: form.category})
			return category?.name

new Tabular.Table
	name: "Flows",
	collection: db.flows,
	pub :"flows_tabular",
	columns: [
		{
			data: "name",
			orderable: false
		},
		{
			data: "category_name()",
			width: "150px",
			orderable: false
		},
		{
			data: "current.modified",
			width: "150px",
			render: (val, type, doc)->
				return moment(doc.current?.modified).format('YYYY-MM-DD HH:mm')
		},
		{
			data: "modified_by_name()",
			width: "150px",
			orderable: false
		},
		{
#			title: ()->
#				"""
#					<span class="filter-span">#{t('flows_state')}</span>
#					<div class="tabular-filter col-state">
#						<div class="btn-group">
#						  <a class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
#							<span class="ion ion-funnel"></span></a>
#						  <ul class="dropdown-menu">
#							<li><a href="#">
#									<label>
#										<input type="checkbox" name='filter_state' value='enabled' data-col='col-state'>启用
#									</label>
#								</a>
#							</li>
#							<li><a href="#">
#									<label>
#										<input type="checkbox" name='filter_state' value='disabled' data-col='col-state'>停用
#									</label>
#								</a>
#							</li>
#						  </ul>
#						</div>
#					</div>
#				"""
#			,
			data: "state",
			width: "150px",
			orderable: false,
			render: (val, type, doc)->

				checked = "";

				if doc.state == 'enabled'
					checked = "checked"

				return """
							<div class="flow-list-switch">
								<label for="switch_#{doc._id}" class="weui-switch-cp">
									<input id="switch_#{doc._id}" data-id="#{doc._id}" class="weui-switch-cp__input flow-switch-input" type="checkbox" #{checked}>
									<div class="weui-switch-cp__box"></div>
								</label>
							</div>
						"""
		},
		{
			data: "auto_remind",
			width: "150px",
			orderable: false,
			render: (val, type, doc)->

				checked = "";

				if doc.auto_remind is true
					checked = "checked"

				return """
							<div class="flow-list-switch">
								<label for="switch_auto_remind_#{doc._id}" class="weui-switch-cp">
									<input id="switch_auto_remind_#{doc._id}" data-id="#{doc._id}" class="weui-switch-cp__input flow-switch-input-enable-auto-remind" type="checkbox" #{checked}>
									<div class="weui-switch-cp__box"></div>
								</label>
							</div>
						"""
		},
		{
			data: "upload_after_being_distributed",
			width: "150px",
			orderable: false,
			render: (val, type, doc)->

				checked = "";

				if doc.upload_after_being_distributed is true
					checked = "checked"

				return """
							<div class="flow-list-switch">
								<label for="switch_upload_after_being_distributed_#{doc._id}" class="weui-switch-cp">
									<input id="switch_upload_after_being_distributed_#{doc._id}" data-id="#{doc._id}" class="weui-switch-cp__input flow-switch-input-upload-after-being-distributed" type="checkbox" #{checked}>
									<div class="weui-switch-cp__box"></div>
								</label>
							</div>
						"""
		},
		{
			data: "",
			title: "",
			orderable: false,
			width: '1px',
			render: (val, type, doc) ->

				return """
						<div class="flow-edit">
							<div class="btn-group">
							  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
								<span class="ion ion-android-more-vertical"></span>
							  </button>
							  <ul class="dropdown-menu dropdown-menu-right" role="menu">
								<li><a href="#" id="editFlow" data-id="#{doc._id}">#{t("Edit")}</a></li>
								<li class="divider"></li>
								<li><a href="#" id="designFlow" data-id="#{doc._id}">#{t("workflow_design_flow")}</a></li>
								<li class="divider"></li>
								<li><a href="#" id="editFlow_template" data-id="#{doc._id}">#{t('flow_list_title_set_template')}</a></li>
								<li><a href="#" id="editFlow_events" data-id="#{doc._id}">#{t('flow_list_title_set_script')}</a></li>
								<li><a href="#" id="editFlow_fieldsMap" data-id="#{doc._id}">#{t('flow_list_title_set_fieldsMap')}</a></li>
								<li><a href="#" id="editFlow_distribute" data-id="#{doc._id}">#{t('flow_list_title_set_distribute')}</a></li>
							  </ul>
							</div>
						</div>
					"""
		}
	]
	order: [[2, "desc"]]
	dom: "tp"
	extraFields: ["form","print_template","instance_template",
				"events","field_map","space", "description",
				"current", "state", "distribute_optional_users",
				"distribute_to_self","distribute_end_notification"]
	lengthChange: false
	pageLength: 10
	info: false
	searching: true
	autoWidth: false

new Tabular.Table
	name: "ImportOrExportFlows",
	collection: db.flows,
	columns: [
		{data: "name", title: "name"},
#		{data: "state", title: "state"},
		{
			data: "",
			title: "",
			orderable: false,
			width: '1px',
			render: (val, type, doc) ->
				return '<a target="_blank" class="btn btn-xs btn-default" id="exportFlow" href="/api/workflow/export/form?form=' + doc.form + '">' + t("flows_btn_export_title") + '</a>'
		}
	]
	dom: "tp"
	extraFields: ["form","print_template","instance_template","events","field_map","space", "current"]
	lengthChange: false
	pageLength: 10
	info: false
	searching: true
	autoWidth: false