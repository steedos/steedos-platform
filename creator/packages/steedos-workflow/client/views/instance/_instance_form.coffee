InstanceformTemplate.helpers =
	applicantContext: ->
		steedos_instance = WorkflowManager.getInstance();
		data = {
			name: 'ins_applicant',
			atts: {name: 'ins_applicant', id: 'ins_applicant', class: 'selectUser form-control ins_applicant'},
			value: steedos_instance.applicant_name
		}
		if not steedos_instance || steedos_instance.state != "draft"
			data.atts.disabled = true
		return data;

	instanceId: ->
		return 'instanceform';#"instance_" + Session.get("instanceId");

	form_types: ->
		if ApproveManager.isReadOnly()
			return 'disabled';
		else
			return 'method';

	steedos_form: ->
		form_version = WorkflowManager.getInstanceFormVersion();
		if form_version
			return form_version

	innersubformContext: (obj)->
		doc_values = WorkflowManager_format.getAutoformSchemaValues();
		obj["tableValues"] = if doc_values then doc_values[obj.code] else []
		obj["formId"] = "instanceform";
		return obj;

	instance: ->
		Session.get("change_date")
		if (Session.get("instanceId"))
			steedos_instance = WorkflowManager.getInstance();
			return steedos_instance;

	empty: (val) ->
		if val
			return false
		else
			return true;

	unempty: (val) ->
		if val
			return true;
		else
			return false;

	equals: (a, b) ->
		return (a == b)

	unequals: (a, b) ->
		return !(a == b)

	includes: (a, b) ->
		return b.split(',').includes(a);

	include: (a, b) ->
		return b.split(',').includes(a);

	fields: ->
		form_version = WorkflowManager.getInstanceFormVersion();
		if form_version
			return new SimpleSchema(WorkflowManager_format.getAutoformSchema(form_version));

	formatDate: (date, options)->
		if !date
			return "";
		if options && typeof(options) == 'string'
			options = JSON.parse(options);

		if !options.format
			options = {format: "YYYY-MM-DD HH:mm"}

		return moment(date).format(options.format);

	traces: ->
		if Meteor.isServer
			steedosData = Template.instance()?.view?.template?.steedosData
			instance = steedosData?.instance
			flow = InstanceReadOnlyTemplate.getFlowVersion(instance);
			locale = steedosData?.locale
			if locale.toLocaleLowerCase() == 'zh-cn'
				locale = "zh-CN"
		else
			instance = WorkflowManager.getInstance();

			flow = WorkflowManager.getInstanceFlowVersion()

			locale = Session.get("TAPi18n::loaded_lang")

		if !instance || !flow
			return {};

		steps = flow.steps;

		traces = {};

		instance.traces?.forEach (trace)->
			step = steps.findPropertyByPK("_id", trace.step)

			approves = []

			trace.approves?.forEach (approve) ->
				if trace.is_finished == true
# 已结束的显示为核准/驳回/取消申请
					if approve.judge == 'approved'
						judge_name = TAPi18n.__("Instance State approved", {}, locale)
					else if approve.judge == 'rejected'
						judge_name = TAPi18n.__("Instance State rejected", {}, locale)
					else if approve.judge == 'terminated'
						judge_name = TAPi18n.__("Instance State terminated", {}, locale)
					else if approve.judge == 'reassigned'
						judge_name = TAPi18n.__("Instance State reassigned", {}, locale)
					else if approve.judge == 'relocated'
						judge_name = TAPi18n.__("Instance State relocated", {}, locale)
					else if approve.judge == ''
						judge_name = ""
					else
						judge_name = ""

				else
					judge_name = TAPi18n.__("Instance State pending", {}, locale)

				approves.push
					_id: approve._id
					handler: approve.user
					handler_name: approve.handler_name
					handler_organization_name: approve.handler_organization_name
					handler_organization_fullname: approve.handler_organization_fullname
					finish_date: approve.finish_date
					judge: approve.judge
					judge_name: judge_name
					description: approve.description
					is_finished: approve.is_finished
					type: approve.type
					opinion_fields_code: approve.opinion_fields_code
					sign_field_code: approve.sign_field_code
					is_read: approve.is_read
					sign_show: approve.sign_show


			if step
				if step.name of traces
					traces[step.name] = traces[step.name].concat(approves)
				else
					traces[step.name] = approves

		return traces;



	doc_values: ->
		WorkflowManager_format.getAutoformSchemaValues();

	instance_box_style: ->
		box = Session.get("box")
		if box == "inbox" || box == "draft"
			judge = Session.get("judge")
			if judge
				if (judge == "approved")
					return "box-success"
				else if (judge == "rejected")
					return "box-danger"
		ins = WorkflowManager.getInstance();
		if ins && ins.final_decision
			if ins.final_decision == "approved"
				return "box-success"
			else if (ins.final_decision == "rejected")
				return "box-danger"

#is_disabled: ->
#    ins = WorkflowManager.getInstance();
#    if !ins
#        return;
#    if ins.state!="draft"
#        return "disabled";
#    return;

	table_fields: (instance)->
		if Meteor.isClient
			form_version = WorkflowManager.getInstanceFormVersion();
		else
			form_version = WorkflowManager.getFormVersion(instance.form, instance.form_version)
		if form_version
			fields = _.clone(form_version.fields);

			fields.forEach (field, index) ->
				field.tr_start = "";
				field.tr_end = "";
				td_colspan = 1;
#				强制设置标头字段为宽字段
				if CoreForm?.pageTitleFieldName == field.code
					field.is_wide = true

				if field.formula && field.type != 'odata'
					field.permission = "readonly";

				if Steedos.isMobile()
# 如果当前字段是分组、表格、宽字段
					if field.type == 'section' || field.type == 'table'
						field.td_colspan = 4;
					else
						field.td_colspan = 3;

					if index != 0
						field.tr_start = "<tr>";
						field.tr_end = "</tr>";
				else
					pre_fields = fields.slice(0, index);

					pre_wide_fields = pre_fields.filterProperty("is_wide", true);

					tr_start = "";

					tr_end = "";

					# 先计算当前字段是否为宽字段
					before_field = null;
					after_field = null;

					if index > 0
						before_field = fields[index - 1]

					if index < fields.length - 1
						after_field = fields[index + 1]

					# 如果当前字段是分组、表格、宽字段
					if field.type == 'section' || field.type == 'table'
						td_colspan = 4;
					else if field.is_wide
						td_colspan = 3;
					else
# 前后都是宽字段
						if before_field && after_field && before_field.is_wide && after_field.is_wide
							field.is_wide = true;
							td_colspan = 3;

						# 当前是tr 下的 第一个td & 后边的字段是宽字段
						if (pre_fields.length + pre_wide_fields.length) % 2 == 0 && after_field && after_field.is_wide
							field.is_wide = true;
							td_colspan = 3;

						# 当前是tr 下的 第一个td & 当前字段是最后一个字段
						if (pre_fields.length + pre_wide_fields.length) % 2 == 0 && after_field == null
							field.is_wide = true;
							td_colspan = 3;

					field.td_colspan = td_colspan;


					if index == 0
# tr_start = "<tr>"; 由于Template的编译bug，导致每次给一个tr开始时，会自动补头或补尾。因此在第一行返回一个空字符串.
						tr_start = "<tr>";
					else
						if (pre_fields.length + pre_wide_fields.length) % 2 == 0 || field.is_wide
							if field.type == 'table'
								tr_start = "<tr class = \"tr-child-table\">";
							else
								tr_start = "<tr>";

					field.tr_start = tr_start;


					if index + 1 == fields.length || field.type == 'section' || field.type == 'table' || field.is_wide
						tr_end = "</tr>";

					if (pre_fields.length + pre_wide_fields.length) % 2 != 0
						tr_end = "</tr>";

					field.tr_end = tr_end;

			return fields;

	sort_approve: (approves, order)->
		if !approves
			return []

		if !approves instanceof Array
			return []
		else
			if order == 'desc'
				approves.sort (p1, p2) ->
					_p1 = 0
					_p2 = 0

					if p1.finish_date
						_p1 = p1.finish_date.getTime()

					if p2.finish_date
						_p2 = p2.finish_date.getTime();

					return _p2 - _p1
			else
				approves.sort (p1, p2) ->
					_p1 = 0
					_p2 = 0

					if p1.finish_date
						_p1 = p1.finish_date.getTime()

					if p2.finish_date
						_p2 = p2.finish_date.getTime();

					return _p1 - _p2
		return approves

	_t: (key)->
		return TAPi18n.__(key)
	getField: (code)->
		form_version = Template.instance().view.template.steedosData.form_version
		if form_version
			return form_version.fields.findPropertyByPK("code", code)

	getValue: (code)->
		instance = Template.instance().view.template.steedosData.instance

		form_version = Template.instance().view.template.steedosData.form_version

		locale = Template.instance().view.template.steedosData.locale

		utcOffset = Template.instance().view.template.steedosData.utcOffset

		values = instance.values || {}

		if Meteor.isClient
			values = WorkflowManager_format.getAutoformSchemaValues()

		return InstanceReadOnlyTemplate.getValue values[code], form_version.fields.findPropertyByPK("code", code), locale, utcOffset

	getLabel: (code)->
		form_version = Template.instance().view.template.steedosData.form_version
		InstanceReadOnlyTemplate.getLabel form_version.fields, code

	getCfClass: (field)->
		if field?.type == "input" && field?.is_textarea
			return "cfTextarea"

	getTableThead: (field)->
		return SteedosTable.getThead(field, false)

	getTableBody: (field)->

		if Meteor.isServer
			instance = Template.instance().view.template.steedosData.instance
			values = instance.values || {}
		else
			values = WorkflowManager_format.getAutoformSchemaValues()

		tableValue = values[field.code];
		return SteedosTable.getTbody(field.sfields.getProperty("code"), field, tableValue, false)

	showLabel: (field)->
		templateData = Template.instance().data
		if templateData.label == false
			return false
		return true

#	afFieldLabelText: (op)->
#		if !Template.instance().view.template.steedosData
#			return AutoForm.getLabelForField(op.name)
#		else
#			form_version = Template.instance().view.template.steedosData.form_version
#			InstanceReadOnlyTemplate.getLabel form_version.fields, op?.hash?.name

	isOpinionField: (field)->
		return InstanceformTemplate.helpers.isOpinionField_from_string(field.formula)

	isOpinionField_from_string: (field_formula)->
		return InstanceSignText.isOpinionField_from_string(field_formula)

	includesOpinionField: (form, form_version)->

		field_formulas = new Array();

		fields = db.form_versions.findOne({_id: form_version, form: form})?.fields || []

		fields.forEach (f)->
			if f.type == 'table'
				console.log 'ignore opinion field in table'
			else if f.type == 'section'
				f?.fields?.forEach (f1)->
					field_formulas.push f1.formula
			else
				field_formulas.push f.formula

		_.some field_formulas, (field_formula)->
			return InstanceformTemplate.helpers.isOpinionField_from_string(field_formula)

	getOpinionFieldStepsName: (field_formula, top_keywords)->

		opinionFields = new Array();
#		console.log("field_formula", field_formula)
		if InstanceformTemplate.helpers.isOpinionField_from_string(field_formula)
			if field_formula

#				foo1 = field_formula.split(",")
				foo1 = field_formula.split(";")

#				if top_keywords
#					foo1 = field_formula.split(";")

				foo1.forEach (foo)->
					json_formula = {}

					try
						json_formula = eval("(" + foo + ")")
					catch
						json_formula = {}

					if json_formula?.yijianlan
						sf = {}

						sf.stepName = json_formula.yijianlan.step

						sf.image_sign = json_formula.yijianlan.image_sign || false

						sf.only_cc_opinion = json_formula.yijianlan.only_cc || false

						sf.default_description = json_formula.yijianlan.default

						sf.only_handler = json_formula.yijianlan.only_handler

						sf.top_keywords = json_formula.yijianlan.top_keywords || top_keywords

						opinionFields.push(sf);

					else if(field_formula?.indexOf("{traces.") > -1 || field_formula?.indexOf("{signature.traces.") > -1)

						sf = {only_cc_opinion: false, image_sign: false, top_keywords: top_keywords}

						if foo.indexOf("{signature.") > -1
							sf.image_sign = true
							foo = foo.replace("{signature.","");

						s1 = foo.replace("{","").replace("}","")
						if s1.split(".").length > 1
							sf.stepName = s1.split(".")[1]
							if opinionFields.filterProperty("stepName",sf.stepName).length > 0
								opinionFields.findPropertyByPK("stepName", sf.stepName)?.only_cc_opinion = true
							else
								if s1.split(".").length > 2
									if s1.split(".")[2]?.toLocaleLowerCase() == 'cc'
										sf.only_cc_opinion = true
						opinionFields.push(sf);

		return opinionFields

	showCCOpinion: (field)->
		if field.formula?.indexOf("{traces.") > -1 || field.formula?.indexOf("{signature.traces.") > -1
			s1 = field.formula.replace("{signature.","").replace("{","").replace("}","")
			if s1.split(".").length > 2
				if s1.split(".")[2]?.toLocaleLowerCase() == 'cc'
					return true
		return false

	markDownToHtml: (markDownString)->
		if markDownString
			renderer = new Markdown.Renderer();
			renderer.link = ( href, title, text ) ->
				return "<a target='_blank' href='#{href}' title='#{title}'>#{text}</a>"
			return Spacebars.SafeString(Markdown(markDownString, {renderer:renderer}))

	f_label: (that)->
		return that.name || that.code

if Meteor.isServer
	InstanceformTemplate.helpers.steedos_form = ->
		return this.form_version

	InstanceformTemplate.helpers.isSection = (code)->
		form_version = this.form_version
		return form_version.fields.findPropertyByPK("code", code).type == 'section'

	InstanceformTemplate.helpers.doc_values = ->
		instance = this.instance;
		return instance.values;

	InstanceformTemplate.helpers.applicantContext = ->
		instance = this.instance;
		data = {
			name: 'ins_applicant',
			atts: {name: 'ins_applicant', id: 'ins_applicant', class: 'selectUser form-control ins_applicant'},
			value: instance.applicant_name
		}

	InstanceformTemplate.helpers.instance = ->
		return this.instance

	InstanceformTemplate.helpers.fields = ->
		form_version = this.form_version
		if form_version
			return new SimpleSchema(WorkflowManager_format.getAutoformSchema(form_version));

	InstanceformTemplate.helpers.form_types = ->
		return "disabled"

	Template.registerHelper "afFieldLabelText", (op)->
		form_version = Template.instance().view.template.steedosData.form_version
		InstanceReadOnlyTemplate.getLabel form_version.fields, op?.hash?.name

	InstanceformTemplate.helpers._t = (key)->
		locale = this.locale

		return TAPi18n.__(key, {}, locale)

	InstanceformTemplate.helpers.ins_attach_download_url = (_id, absolute)->
		if absolute
			return Meteor.absoluteUrl("/api/files/instances/#{_id}?download=true");
		else
			return "/api/files/instances/#{_id}?download=true";

	InstanceformTemplate.helpers.options = (field)->
		options = field?.options?.split("\n")
		rev = []
		options?.forEach (item)->
			rev.push({label: item, value: item})

		return rev

	InstanceformTemplate.helpers.getPermissions = (code)->
		if !Template.instance().view.template.steedosData.startStepEditableFields?.includes(code)
			return "readonly disabled"
		return ""

InstanceformTemplate.events =
	'change .form-control,.checkbox input,.af-radio-group input,.af-checkbox-group input': (event)->
		InstanceManager.instanceformChangeEvent(event)

	'typeahead:change .form-control': (event) ->
		InstanceManager.instanceformChangeEvent(event)

	'click .cfTextarea a': (event)->
		event.preventDefault();
		Steedos.openWindow(event.target.href);


InstanceformTemplate.onCreated = ()->
	instance = WorkflowManager.getInstance();
	if !instance
		return;

	template = TemplateManager.getTemplate(instance);

	try
		compiled = SpacebarsCompiler.compile(template, {isBody: true});
	catch e
		console.log "Instance Template Error", e
		compiled = SpacebarsCompiler.compile("", {isBody: true});


	renderFunction = eval(compiled);

	instanceView = new Blaze.View("custom_instance_template", renderFunction);

	instanceCustomTemplate = new Blaze.Template(instanceView.name, renderFunction);

	Template.instance_custom_template = instanceCustomTemplate

	Template.instance_custom_template.helpers InstanceformTemplate.helpers




InstanceformTemplate.onRendered = ()->
	# t = this;

	#t.subscribe "instance_data", Session.get("instanceId"), ->
	#    Tracker.afterFlush ->
	instance = WorkflowManager.getInstance();
	if !instance
		return;

	#$("#ins_applicant").select2().val(instance.applicant).trigger('change');
	#$("#ins_applicant").val(instance.applicant);
	$("input[name='ins_applicant']")[0]?.dataset.values = instance.applicant;
	$("input[name='ins_applicant']").val(instance.applicant_name)


	ApproveManager.error = {nextSteps: '', nextStepUsers: ''};

	# instance from绑定事件
	if Session.get("box") == 'inbox' || Session.get("box") == 'draft'
		InstanceEvent.initEvents(instance.flow);

	if !ApproveManager.isReadOnly()

		currentApprove = InstanceManager.getCurrentApprove();


		instanceNumberFields = $("[data-formula]", $("#instanceform"))

		instanceNumberFields.each ()->
			schemaKey = this.dataset.schemaKey
			element = $(this)
			if !$(this).val() && schemaKey && Session.get("instanceId")
				Meteor.call 'getInstanceValues', Session.get("instanceId"), (error, result)->
					if error
						toastr.error(error.reason)

					if !result[schemaKey]
						key = element.data("formula")?.replace("auto_number(", "").replace(")", "")

						key = key.replace(/\"/g, "").replace(/\'/g, "")

						if key.indexOf("{") > -1
							key = key.replace("{","").replace("}","")
							key = key.trim()
							key = AutoForm.getFieldValue(key, 'instanceform')
						InstanceNumberRules.instanceNumberBuilder element, key
					else
						element?.val(result[schemaKey]).trigger("change")

		judge = currentApprove.judge
		currentStep = InstanceManager.getCurrentStep();
		form_version = WorkflowManager.getInstanceFormVersion();

		formula_fields = Form_formula.getFormulaFieldVariable("Form_formula.field_values", form_version.fields);
		Form_formula.run("", "", formula_fields, AutoForm.getFormValues("instanceform").insertDoc, form_version.fields);
		#在此处初始化session 中的 form_values 变量，用于触发下一步步骤计算
		Session.set("instance_form_values", {instanceId: instance._id, values: AutoForm.getFormValues("instanceform").insertDoc});



