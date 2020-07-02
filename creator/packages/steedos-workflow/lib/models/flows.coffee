# db.flows = new Meteor.Collection('flows')

# if Meteor.isServer
# 	db.flows.before.insert (userId, doc) ->
# 		doc.created_by = userId;
# 		doc.created = new Date();
# 		if doc.current
# 			doc.current.created_by = userId;
# 			doc.current.created = new Date();
# 			doc.current.modified_by = userId;
# 			doc.current.modified = new Date();

# db.flows._simpleSchema = new SimpleSchema
# 	space:
# 		type: String,
# 		autoform:
# 			type: "hidden",
# 			defaultValue: ->
# 				return Session.get("spaceId");
# 	name:
# 		type: String

# 	print_template:
# 		type: String,
# 		optional: true
# 		autoform:
# 			rows: 10,

# 	instance_template:
# 		type: String,
# 		optional: true
# 		autoform:
# 			rows: 10,

# 	name_formula:
# 		type: String
# 		optional: true
# 		autoform:
# 			omit: true

# 	code_formula:
# 		type: String
# 		optional: true
# 		autoform:
# 			omit: true

# 	description:
# 		type: String
# 		optional: true
# 		autoform:
# 			rows: 5

# 	is_valid:
# 		type: Boolean
# 		optional: true
# 		autoform:
# 			omit: true

# 	form:
# 		type: String
# 		optional: true
# 		autoform:
# 			omit: true

# 	flowtype:
# 		type: String
# 		optional: true
# 		autoform:
# 			omit: true

# 	state:
# 		type: String
# 		optional: true
# 		defaultValue: "disabled"
# 		autoform:
# 			omit: true

# 	is_deleted:
# 		type: Boolean
# 		optional: true
# 		autoform:
# 			omit: true

# 	created:
# 		type: Date
# 		optional: true
# 		autoform:
# 			omit: true

# 	created_by:
# 		type: String
# 		optional: true
# 		autoform:
# 			omit: true

# 	help_text:
# 		type: String
# 		optional: true
# 		autoform:
# 			omit: true

# 	current_no:
# 		type: Number
# 		optional: true
# 		autoform:
# 			omit: true

# 	current:
# 		type: Object
# 		optional: true
# 		blackbox: true
# 		autoform:
# 			omit: true

# 	historys:
# 		type: [Object]
# 		optional: true
# 		blackbox: true
# 		autoform:
# 			omit: true

# 	perms:
# 		type: Object
# 		optional: true
# 		blackbox: true
# 		autoform:
# 			omit: true

# 	error_message:
# 		type: Object
# 		optional: true
# 		blackbox: true
# 		autoform:
# 			omit: true

# 	app:
# 		type: String
# 		optional: true
# 		autoform:
# 			omit: true

# 	events:
# 		type: String
# 		optional: true
# 		autoform:
# 			rows: 20

# 	field_map:
# 		type: String
# 		optional: true
# 		autoform:
# 			rows: 20

# 	distribute_optional_users:
# 		type: [Object]
# 		optional: true
# 		blackbox: true
# 		autoform:
# 			omit: true

# 	'current.steps.$.distribute_optional_flows':
# 		type: [String]
# 		optional: true
# 		autoform:
# 			omit: true

# 	distribute_to_self:
# 		type: Boolean
# 		optional: true
# 		autoform:
# 			omit: true

# 	distribute_end_notification:
# 		type: Boolean
# 		optional: true
# 		autoform:
# 			omit: true

# 	auto_remind:
# 		type: Boolean
# 		optional: true
# 		autoform:
# 			omit: true

# 	upload_after_being_distributed:
# 		type: Boolean
# 		optional: true
# 		autoform:
# 			omit: true

# 	company_id:
# 		type: String
# 		optional: true
# 		autoform:
# 			omit: true

# if Meteor.isClient
# 	db.flows._simpleSchema.i18n("flows")

# db.flows.attachSchema(db.flows._simpleSchema)

# if Meteor.isServer

# 	db.flows.allow
# 		insert: (userId, event) ->
# 			return false

# 		update: (userId, event) ->
# 			if (!Steedos.isSpaceAdmin(event.space, userId))
# 				return false
# 			else
# 				return true

# 		remove: (userId, event) ->
# 			return false

# 	db.flows.before.insert (userId, doc) ->
# 		doc.created_by = userId;
# 		doc.created = new Date();

# 		if (!Steedos.isSpaceAdmin(doc.space, userId))
# 			throw new Meteor.Error(400, "error_space_admins_only");

# 	db.flows.before.update (userId, doc, fieldNames, modifier, options) ->

# 		modifier.$set = modifier.$set || {};

# 		if !modifier.$set.current
# 			if _.keys(modifier.$set).toString() isnt 'auto_remind' and _.keys(modifier.$set).toString() isnt 'upload_after_being_distributed' # 为了启用自动催办的时候流程在列表位置不变
# 				modifier.$set['current.modified_by'] = userId;
# 				modifier.$set['current.modified'] = new Date();

# 		if (!Steedos.isLegalVersion(doc.space,"workflow.professional"))
# 			throw new Meteor.Error(400, "space_paid_info_title");
# 		if (!Steedos.isSpaceAdmin(doc.space, userId))
# 			throw new Meteor.Error(400, "error_space_admins_only");

# 	db.flows.before.remove (userId, doc) ->

# 		if (!Steedos.isSpaceAdmin(doc.space, userId))
# 			throw new Meteor.Error(400, "error_space_admins_only");

# db.flows.helpers
# 	modified_by_name: () ->
# 		spaceUser = db.space_users.findOne({user: this.current?.modified_by}, {fields: {name: 1}});
# 		return spaceUser?.name;

# 	category_name: ()->
# 		form = db.forms.findOne({_id: this.form, space: this.space});

# 		if form && form.category
# 			category = db.categories.findOne({_id: form.category})
# 			return category?.name

# new Tabular.Table
# 	name: "Flows",
# 	collection: db.flows,
# 	pub :"flows_tabular",
# 	columns: [
# 		{
# 			data: "name",
# 			orderable: false
# 		},
# 		{
# 			data: "category_name()",
# 			width: "150px",
# 			orderable: false
# 		},
# 		{
# 			data: "current.modified",
# 			width: "150px",
# 			render: (val, type, doc)->
# 				return moment(doc.current?.modified).format('YYYY-MM-DD HH:mm')
# 		},
# 		{
# 			data: "modified_by_name()",
# 			width: "150px",
# 			orderable: false
# 		},
# 		{
# #			title: ()->
# #				"""
# #					<span class="filter-span">#{t('flows_state')}</span>
# #					<div class="tabular-filter col-state">
# #						<div class="btn-group">
# #						  <a class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
# #							<span class="ion ion-funnel"></span></a>
# #						  <ul class="dropdown-menu">
# #							<li><a href="#">
# #									<label>
# #										<input type="checkbox" name='filter_state' value='enabled' data-col='col-state'>启用
# #									</label>
# #								</a>
# #							</li>
# #							<li><a href="#">
# #									<label>
# #										<input type="checkbox" name='filter_state' value='disabled' data-col='col-state'>停用
# #									</label>
# #								</a>
# #							</li>
# #						  </ul>
# #						</div>
# #					</div>
# #				"""
# #			,
# 			data: "state",
# 			width: "150px",
# 			orderable: false,
# 			render: (val, type, doc)->

# 				checked = "";

# 				if doc.state == 'enabled'
# 					checked = "checked"

# 				return """
# 							<div class="flow-list-switch">
# 								<label for="switch_#{doc._id}" class="weui-switch-cp">
# 									<input id="switch_#{doc._id}" data-id="#{doc._id}" class="weui-switch-cp__input flow-switch-input" type="checkbox" #{checked}>
# 									<div class="weui-switch-cp__box"></div>
# 								</label>
# 							</div>
# 						"""
# 		},
# 		{
# 			data: "auto_remind",
# 			width: "150px",
# 			orderable: false,
# 			render: (val, type, doc)->

# 				checked = "";

# 				if doc.auto_remind is true
# 					checked = "checked"

# 				return """
# 							<div class="flow-list-switch">
# 								<label for="switch_auto_remind_#{doc._id}" class="weui-switch-cp">
# 									<input id="switch_auto_remind_#{doc._id}" data-id="#{doc._id}" class="weui-switch-cp__input flow-switch-input-enable-auto-remind" type="checkbox" #{checked}>
# 									<div class="weui-switch-cp__box"></div>
# 								</label>
# 							</div>
# 						"""
# 		},
# 		{
# 			data: "upload_after_being_distributed",
# 			width: "150px",
# 			orderable: false,
# 			render: (val, type, doc)->

# 				checked = "";

# 				if doc.upload_after_being_distributed is true
# 					checked = "checked"

# 				return """
# 							<div class="flow-list-switch">
# 								<label for="switch_upload_after_being_distributed_#{doc._id}" class="weui-switch-cp">
# 									<input id="switch_upload_after_being_distributed_#{doc._id}" data-id="#{doc._id}" class="weui-switch-cp__input flow-switch-input-upload-after-being-distributed" type="checkbox" #{checked}>
# 									<div class="weui-switch-cp__box"></div>
# 								</label>
# 							</div>
# 						"""
# 		},
# 		{
# 			data: "",
# 			title: "",
# 			orderable: false,
# 			width: '1px',
# 			render: (val, type, doc) ->

# 				return """
# 						<div class="flow-edit">
# 							<div class="btn-group">
# 							  <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
# 								<span class="ion ion-android-more-vertical"></span>
# 							  </button>
# 							  <ul class="dropdown-menu dropdown-menu-right" role="menu">
# 								<li><a href="#" id="editFlow" data-id="#{doc._id}">#{t("Edit")}</a></li>
# 								<li class="divider"></li>
# 								<li><a target="_blank" id="exportFlow" href="/api/workflow/export/form?form=#{doc.form}">#{t("flows_btn_export_title")}</a></li>
# 								<li><a href="#" id="copyFlow" data-id="#{doc._id}">#{t("workflow_copy_flow")}</a></li>
# 								<li><a href="#" id="designFlow" data-id="#{doc._id}">#{t("workflow_design_flow")}</a></li>
# 								<li class="divider"></li>
# 								<li><a href="#" id="editFlow_template" data-id="#{doc._id}">#{t('flow_list_title_set_template')}</a></li>
# 								<li><a href="#" id="editFlow_events" data-id="#{doc._id}">#{t('flow_list_title_set_script')}</a></li>
# 								<li><a href="#" id="editFlow_fieldsMap" data-id="#{doc._id}">#{t('flow_list_title_set_fieldsMap')}</a></li>
# 								<li><a href="#" id="editFlow_distribute" data-id="#{doc._id}">#{t('flow_list_title_set_distribute')}</a></li>
# 							  </ul>
# 							</div>
# 						</div>
# 					"""
# 		}
# 	]
# 	order: [[2, "desc"]]
# 	dom: "tp"
# 	extraFields: ["form","print_template","instance_template",
# 				"events","field_map","space", "description",
# 				"current", "state", "distribute_optional_users",
# 				"distribute_to_self","distribute_end_notification"]
# 	lengthChange: false
# 	pageLength: 10
# 	info: false
# 	searching: true
# 	autoWidth: false

# new Tabular.Table
# 	name: "ImportOrExportFlows",
# 	collection: db.flows,
# 	columns: [
# 		{data: "name", title: "name"},
# #		{data: "state", title: "state"},
# 		{
# 			data: "",
# 			title: "",
# 			orderable: false,
# 			width: '1px',
# 			render: (val, type, doc) ->
# 				return '<a target="_blank" class="btn btn-xs btn-default" id="exportFlow" href="/api/workflow/export/form?form=' + doc.form + '">' + t("flows_btn_export_title") + '</a>'
# 		}
# 	]
# 	dom: "tp"
# 	extraFields: ["form","print_template","instance_template","events","field_map","space", "current"]
# 	lengthChange: false
# 	pageLength: 10
# 	info: false
# 	searching: true
# 	autoWidth: false

# if Meteor.isServer
# 	db.flows._ensureIndex({
# 		"is_deleted": 1
# 	},{background: true})

# 	db.flows._ensureIndex({
# 		"space": 1
# 	},{background: true})

# 	db.flows._ensureIndex({
# 		"space": 1,
# 		"is_deleted": 1
# 	},{background: true})

# 	db.flows._ensureIndex({
# 		"role": 1,
# 		"is_deleted": 1
# 	},{background: true})

# 	db.flows._ensureIndex({
# 		"space": 1,
# 		"app": 1,
# 		"created": 1
# 	},{background: true})

# 	db.flows._ensureIndex({
# 		"space": 1,
# 		"app": 1,
# 		"created": 1,
# 		"current.modified": 1
# 	},{background: true})

# 	db.flows._ensureIndex({
# 		"name": 1,
# 		"space": 1
# 	},{background: true})

# 	db.flows._ensureIndex({
# 		"form": 1,
# 		"is_deleted": 1
# 	},{background: true})

# 	db.flows._ensureIndex({
# 		"current.steps.approver_roles": 1,
# 		"space": 1,
# 		"is_deleted": 1
# 	},{background: true})

# 	db.flows._ensureIndex({
# 		"_id": 1,
# 		"space": 1,
# 		"is_deleted": 1
# 	},{background: true})

# 	db.flows._ensureIndex({
# 		"space": 1,
# 		"form": 1
# 	},{background: true})

# 	db.flows._ensureIndex({
# 		"form": 1
# 	},{background: true})

# 	db.flows._ensureIndex({
# 		"space": 1,
# 		"form": 1,
# 		"state:": 1
# 	},{background: true})
