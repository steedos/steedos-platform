InstanceReadOnlyTemplate = {};


InstanceReadOnlyTemplate.instance_attachment = """
	<tr>
		<td class="ins-attach-view">
			<a href="{{ins_attach_download_url _id absolute}}" class="ins_attach_href" target="_parent" data-name="{{this.name}}" data-type="{{this.original.type}}" data-id="{{_id}}">{{this.name}}</a>
		</td>
	</tr>
"""

InstanceReadOnlyTemplate.afSelectUserRead = """
	<div class='selectUser form-control ins_applicant'>{{value}}</div>
"""


InstanceReadOnlyTemplate.afFormGroupRead = """
	<div class='form-group'>
		{{#with getField this.name}}
			{{#if equals type 'section'}}
					<div class='section callout callout-default'>
						<label class="control-label">{{f_label this}}</label>
						<p>{{{description}}}</p>
					</div>
			{{else}}
				{{#if equals type 'table'}}
					<div class="panel panel-default steedos-table">
						<div class="panel-body" style="padding:0px;">
							<div class="panel-heading" >
								<label class='control-label'>{{getLabel code}}</label>
								<span class="description">{{{description}}}</span>
							</div>
							<div class="readonly-table" style="padding:0px;overflow-x:auto;">
									<table type='table' class="table table-bordered table-condensed autoform-table" style='margin-bottom:0px;' {{this.atts}} id="{{this.code}}Table" name="{{this.code}}" data-schema-key="{{this.name}}">
										<thead id="{{this.name}}Thead" name="{{this.name}}Thead">
											{{{getTableThead this}}}
										</thead>
										<tbody id="{{this.name}}Tbody" name="{{this.name}}Tbody">
											{{{getTableBody this}}}
										</tbody>
									</table>
							</div>
						</div>
					</div>
				{{else}}
					{{#if showLabel}}
						<label>{{getLabel code}}</label>
					{{/if}}
					<div class='{{getCfClass this}} form-control' readonly disabled>{{{getValue code}}}</div>
				{{/if}}
			{{/if}}
		{{/with}}
	</div>
"""

InstanceReadOnlyTemplate.afFormGroup = """

	{{#with getField this.name}}
			{{#if equals type 'section'}}
				<div class="form-group">
					<div class='section callout callout-default'>
						<label class="control-label">{{f_label this}}</label>
						<p>{{{description}}}</p>
					</div>
  				</div>
			{{else}}
				{{#if equals type 'table'}}
					<div class="panel panel-default steedos-table">
						<div class="panel-body" style="padding:0px;">
							<div class="panel-heading" >
								<label class='control-label'>{{getLabel code}}</label>
								<span class="description">{{{description}}}</span>
							</div>
							<div class="readonly-table" style="padding:0px;overflow-x:auto;">
									<table type='table' class="table table-bordered table-condensed autoform-table" style='margin-bottom:0px;' {{this.atts}} id="{{this.code}}Table" name="{{this.code}}" data-schema-key="{{this.name}}">
										<thead id="{{this.name}}Thead" name="{{this.name}}Thead">
											{{{getTableThead this}}}
										</thead>
										<tbody id="{{this.name}}Tbody" name="{{this.name}}Tbody">
											{{{getTableBody this}}}
										</tbody>
									</table>
							</div>
						</div>
					</div>
				{{else}}
					{{#if equals type 'input'}}
						<div class="form-group" data-required="{{#if is_required}}true{{/if}}">
							<label for="7ZQnDsXBGohZMetA5" class="control-label">{{getLabel code}}</label>
							<input type="text" title="{{getLabel code}}" name="{{code}}" {{getPermissions code}} data-schema-key="{{getLabel code}}" class="form-control">
						</div>
					{{else}}
						{{#if equals type 'number'}}
							<div class="form-group">
								<label for="7ZQnDsXBGohZMetA5" class="control-label">{{getLabel code}}</label>
								<input type="number" title="{{getLabel code}}" name="{{code}}" data-schema-key="{{getLabel code}}" class="form-control">
							</div>
						{{else}}
							{{#if equals type 'date'}}
								<div class="form-group">
									<label for="7ZQnDsXBGohZMetA5" class="control-label">{{getLabel code}}</label>
									<input type="text" title="{{getLabel code}}" name="{{code}}" data-type="date" data-schema-key="{{getLabel code}}" class="form-control">
								</div>
							{{else}}
								{{#if equals type 'dateTime'}}
									<div class="form-group">
										<label for="7ZQnDsXBGohZMetA5" class="control-label">{{getLabel code}}</label>
										<input type="text" title="{{getLabel code}}" name="{{code}}" data-type='datetime' data-schema-key="{{getLabel code}}" class="form-control">
									</div>
								{{else}}
									{{#if equals type 'password'}}
										<div class="form-group">
											<label for="7ZQnDsXBGohZMetA5" class="control-label">{{getLabel code}}</label>
											<input type="password" title="{{getLabel code}}" name="{{code}}" data-schema-key="{{getLabel code}}" class="form-control">
										</div>
									{{else}}
										{{#if equals type 'select'}}
											<div class="form-group">
												<label for="7ZQnDsXBGohZMetA5" class="control-label">{{getLabel code}}</label>
												<select name="{{code}}" data-schema-key="{{getLabel code}}" class="form-control">
													{{#each options this}}
														<option value="{{value}}">{{label}}</option>
													{{/each}}
												</select>
											</div>
										{{else}}
											{{#if equals type 'radio'}}
												<div class="form-group">
													<label for="7ZQnDsXBGohZMetA5" class="control-label">{{getLabel code}}</label>
													<div class="af-radio-group" data-schema-key="{{getLabel code}}">
														{{#each options this}}
        												<label class="radio-inline fix-indent"><input type="radio" value="{{value}}" name="{{../code}}" class="radio-inline fix-indent"> {{label}}</label>
    													{{/each}}
    												</div>
												</div>
											{{else}}
												{{#if equals type 'multiSelect'}}
													<div class="form-group">
														<label for="7ZQnDsXBGohZMetA5" class="control-label">{{getLabel code}}</label>
														<div class="af-checkbox-group" data-schema-key="{{getLabel code}}">
															{{#each options this}}
															<label class="checkbox-inline fix-indent"><input type="checkbox" value="{{value}}" name="{{../code}}" class="checkbox-inline fix-indent"> {{label}}</label>
															{{/each}}
														</div>
													</div>
												{{else}}
													{{#if equals type 'url'}}
														<div class="form-group">
															<label for="7ZQnDsXBGohZMetA5" class="control-label">{{getLabel code}}</label>
															<input type="url" title="{{getLabel code}}" name="{{code}}" data-schema-key="{{getLabel code}}" class="form-control">
														</div>
													{{else}}
														{{#if equals type 'email'}}
															<div class="form-group">
																<label for="7ZQnDsXBGohZMetA5" class="control-label">{{getLabel code}}</label>
																<input type="email" title="{{getLabel code}}" name="{{code}}" data-schema-key="{{getLabel code}}" class="form-control">
															</div>
														{{else}}
															{{#if equals type 'checkbox'}}
																<div class="form-group">
																	<label for="7ZQnDsXBGohZMetA5" class="control-label">{{getLabel code}}</label>
																	<div class="checkbox" data-schema-key="{{getLabel code}}">
																		<label style="width: 100%;"><input type="checkbox" value="true" name="{{code}}" class="checkbox-inline fix-indent"></label>
																	</div>
																</div>
															{{else}}
																<div class="form-group">
																	<label for="7ZQnDsXBGohZMetA5" class="control-label">{{getLabel code}}</label>
																	<div class='{{getCfClass this}} form-control' readonly disabled>{{{getValue code}}}</div>
																</div>
															{{/if}}
														{{/if}}
													{{/if}}
												{{/if}}
											{{/if}}
										{{/if}}
									{{/if}}
								{{/if}}
							{{/if}}
						{{/if}}
					{{/if}}
				{{/if}}
			{{/if}}
		{{/with}}
"""

InstanceReadOnlyTemplate.create = (tempalteName, steedosData) ->
	template = InstanceReadOnlyTemplate[tempalteName]

	templateCompiled = SpacebarsCompiler.compile(template, {isBody: true});

	templateRenderFunction = eval(templateCompiled);

	Template[tempalteName] = new Blaze.Template(tempalteName, templateRenderFunction);
	Template[tempalteName].steedosData = steedosData
	Template[tempalteName].helpers InstanceformTemplate.helpers

InstanceReadOnlyTemplate.createInstanceSignText = (steedosData)->
	instanceSignTextHtml = _getViewHtml('client/views/instance/instance_sign_text.html')

	instanceSignTextCompiled = SpacebarsCompiler.compile(instanceSignTextHtml, {isBody: true});

	instanceSignTextRenderFunction = eval(instanceSignTextCompiled);

	Template.instanceSignText = new Blaze.Template("instanceSignText", instanceSignTextRenderFunction);
	Template.instanceSignText.steedosData = steedosData
	Template.instanceSignText.helpers InstanceSignText.helpers

InstanceReadOnlyTemplate.createImageSign = (steedosData) ->
	imageSignHtml = _getViewHtml('client/views/instance/image_sign.html')
	imageSignCompiled = SpacebarsCompiler.compile(imageSignHtml, {isBody: true});
	imageSignRenderFunction = eval(imageSignCompiled);
	Template.imageSign = new Blaze.Template("imageSign", imageSignRenderFunction);
	Template.imageSign.steedosData = steedosData
	Template.imageSign.helpers ImageSign.helpers


InstanceReadOnlyTemplate.init = (steedosData) ->
	InstanceReadOnlyTemplate.create("afSelectUserRead", steedosData);

	if Meteor.isServer
		InstanceReadOnlyTemplate.create("afFormGroup", steedosData);

	InstanceReadOnlyTemplate.create("afFormGroupRead", steedosData);
	if Meteor.isServer
		InstanceReadOnlyTemplate.create("instance_attachment", {absolute: steedosData.absolute});
		InstanceReadOnlyTemplate.createImageSign(steedosData)
		InstanceReadOnlyTemplate.createInstanceSignText(steedosData)



InstanceReadOnlyTemplate.getValue = (value, field, locale, utcOffset) ->
	if !value && value != false
		return ''
	switch field.type
		when 'email'
			value = if value then '<a href=\'mailto:' + value + '\'>' + value + '</a>' else ''
		when 'url'
			if value
				if value.indexOf("http") == 0
					try
						value = "<a href='" + encodeURI(value) + "' target='_blank'>" + value + "</a>";
					catch e
						value = "<a href='' target='_blank'>" + value + "</a>";

				else
					value = "<a href='http://" + encodeURI(value) + "' target='_blank'>" + value + "</a>";
			else
				value = ''
		when 'group'
			if field.is_multiselect
				value = value?.getProperty("fullname").toString()
			else
				value = value?.fullname
		when 'user'
			if field.is_multiselect
				value = value?.getProperty("name").toString()
			else
				value = value?.name
		when 'password'
			value = '******'
		when 'checkbox'
			if value && value != 'false'
				value = TAPi18n.__("form_field_checkbox_yes", {}, locale)
			else
				value = TAPi18n.__("form_field_checkbox_no", {}, locale)
		when 'dateTime'
			if value && value.length == 16
				t = value.split("T")
				t0 = t[0].split("-");
				t1 = t[1].split(":");

				year = t0[0];
				month = t0[1];
				date = t0[2];
				hours = t1[0];
				seconds = t1[1];

				value = new Date(year, month - 1, date, hours, seconds)
			else
				value = new Date(value)

			value = InstanceReadOnlyTemplate.formatDate(value, utcOffset);
		when 'input'
			if field.is_textarea
				value = Spacebars.SafeString(Markdown(value))
		when 'number'
			if value or value == 0
				if typeof value == 'string'
					value = parseFloat(value)
				value = value.toFixed(field.digits)
				value = Steedos.numberToString value, locale
		when 'odata'
			value = value['@label']

	return value;

InstanceReadOnlyTemplate.getLabel = (fields, code) ->
	field = fields.findPropertyByPK("code", code)
	if field
		if field.name
			return field.name
		else
			return field.code


InstanceReadOnlyTemplate.getInstanceFormVersion = (instance)->
	form = db.forms.findOne(instance.form);

	form_version = {}

	form_fields = [];

	if form.current._id == instance.form_version
		form_version = form.current
	else
		form_version = _.where(form.historys, {_id: instance.form_version})[0]

	form_version.fields.forEach (field)->
		if field.type == 'section'
			form_fields.push(field);
			if field.fields
				field.fields.forEach (f) ->
					form_fields.push(f);
		else if field.type == 'table'
			field['sfields'] = field['fields']
			delete field['fields']
			form_fields.push(field);
		else
			form_fields.push(field);

	form_version.fields = form_fields;

	return form_version;

InstanceReadOnlyTemplate.getFlowVersion = (instance)->
	flow = db.flows.findOne(instance.flow);
	flow_version = {}
	if flow.current._id == instance.flow_version
		flow_version = flow.current
	else
		flow_version = _.where(flow.historys, {_id: instance.flow_version})[0]

	return flow_version;


_getViewHtml = (path) ->
	viewHtml = Assets.getText(path)

	if viewHtml
		viewHtml = viewHtml.replace(/<template[\w\s\"\=']+>/i,"").replace(/<\/template>/i,"")

	return viewHtml;

_getLocale = (user)->
	if user?.locale?.toLocaleLowerCase() == 'zh-cn'
		locale = "zh-CN"
	else if user?.locale?.toLocaleLowerCase() == 'en-us'
		locale = "en"
	else
		locale = "zh-CN"
	return locale


_getRequiredFields = (fields, rev)->
	if !rev
		rev = [];

	fields.forEach (field)->
		if field.type == 'section'
			_getRequiredFields(field.fields, rev)
		else if field.type == 'table'

		else
			if field.is_required
				rev.push field.code
	return rev;

_getStartStepEditableFields = (fields, steps)->
	startStep = steps.findPropertyByPK("step_type","start")

	editableCode = []

	_.keys(startStep.permissions).forEach (key)->
		if startStep.permissions[key] == 'editable'
			editableCode.push key

	return editableCode

_getStartStepRequiredFields = (fields, steps)->
	requiredFields = _getRequiredFields(fields)

	editableCode = _getStartStepEditableFields(fields, steps)

	return _.intersection(requiredFields, editableCode)

_getTemplateData = (user, space, instance, options)->
	if Meteor.isServer
		form_version = InstanceReadOnlyTemplate.getInstanceFormVersion(instance)
	else
		form_version = WorkflowManager.getInstanceFormVersion(instance)

	locale = _getLocale(user)

	steedosData = {}

	if Meteor.isClient
		steedosData = _.clone(WorkflowManager_format.getAutoformSchemaValues())
		steedosData.insname = instance.name
		steedosData.ins_state = instance.state
		steedosData.ins_final_decision = instance.ins_final_decision
		steedosData.ins_code = instance.code
		steedosData.ins_is_archived = instance.is_archived
		steedosData.ins_is_deleted = instance.ins_is_deleted
		steedosData.applicant_name = instance.applicant_name
		steedosData.applicantContext = instance.applicant_name

	steedosData.instance = instance
	steedosData.form_version = form_version
	steedosData.locale = locale
	steedosData.utcOffset = user.utcOffset
	steedosData.space = instance.space
	steedosData.sessionUserId = user._id

	if Meteor.isServer
		if options?.editable
			form = db.forms.findOne({_id: instance.form})

			flow = db.flows.findOne({_id: instance.flow})

			steedosData.startStepEditableFields = _getStartStepEditableFields(form.current.fields, flow.current.steps);

	return steedosData;

InstanceReadOnlyTemplate.formatDate = (date, utcOffset)->
	if Meteor.isServer
		passing = false;
	else
		passing = true;

	if !utcOffset && utcOffset !=0
		utcOffset = 8

	return moment(date).utcOffset(utcOffset, passing).format("YYYY-MM-DD HH:mm");

InstanceReadOnlyTemplate.getInstanceView = (user, space, instance, options)->

	steedosData = _getTemplateData(user, space, instance, options)

	steedosData.absolute = false;

	if options?.absolute
		steedosData.absolute = true;

	instanceTemplate = TemplateManager.getTemplate(instance, options?.templateName);

	instanceTemplate = instanceTemplate.replace(/afSelectUser/g,"afSelectUserRead")

	if !options?.editable
		instanceTemplate = instanceTemplate.replace(/afFormGroup/g,"afFormGroupRead")

	instanceCompiled = SpacebarsCompiler.compile(instanceTemplate, {isBody: true});

	instanceRenderFunction = eval(instanceCompiled);

	Template.instance_readonly_view = new Blaze.Template("instance_readonly_view", instanceRenderFunction);

	Template.instance_readonly_view.steedosData = steedosData

	Template.instance_readonly_view.helpers InstanceformTemplate.helpers

	InstanceReadOnlyTemplate.init(steedosData);

	body = Blaze.toHTMLWithData(Template.instance_readonly_view, steedosData)

	return """
		<div id='instanceform' >
			#{body}
		</div>
	"""

InstanceReadOnlyTemplate.getTracesView = (user, space, instance, options)->

	steedosData = _getTemplateData(user, space, instance)

	form = db.forms.findOne(instance.form);
	if form.instance_style == "table" || options?.templateName == "table"
		tracesHtml = _getViewHtml('client/views/instance/traces_table.html')
	else
		tracesHtml = _getViewHtml('client/views/instance/traces.html')

	traceCompiled = SpacebarsCompiler.compile(tracesHtml, {isBody: true});

	traceRenderFunction = eval(traceCompiled);

	Template.trace_readonly_view = new Blaze.Template("trace_readonly_view", traceRenderFunction);

	Template.trace_readonly_view.steedosData = steedosData

	Template.trace_readonly_view.helpers TracesTemplate.helpers

	body = Blaze.toHTMLWithData(Template.trace_readonly_view, instance.traces)

	return body;

InstanceReadOnlyTemplate.getAttachmentView = (user, space, instance)->

	steedosData = _getTemplateData(user, space, instance)

	attachmentHtml = _getViewHtml('client/views/instance/instance_attachments.html')

	attachmentCompiled = SpacebarsCompiler.compile(attachmentHtml, {isBody: true});

	attachmentRenderFunction = eval(attachmentCompiled);

	Template.attachments_readonly_view = new Blaze.Template("attachments_readonly_view", attachmentRenderFunction);

	Template.attachments_readonly_view.steedosData = steedosData

	Template.attachments_readonly_view.helpers InstanceAttachmentTemplate.helpers

	body = Blaze.toHTMLWithData(Template.attachments_readonly_view)

	return body;

InstanceReadOnlyTemplate.getRelatedInstancesView = (user, space, instance, options)->
	steedosData = _getTemplateData(user, space, instance)

	steedosData.absolute = false;

	if options?.absolute
		steedosData.absolute = true;

	relatedInstancesHtml = _getViewHtml('client/views/instance/related_instances.html')

	relatedInstancesCompiled = SpacebarsCompiler.compile(relatedInstancesHtml, {isBody: true});

	relatedInstancesRenderFunction = eval(relatedInstancesCompiled);

	Template.related_instances_view = new Blaze.Template("related_instances_view", relatedInstancesRenderFunction);

	Template.related_instances_view.steedosData = steedosData

	Template.related_instances_view.helpers RelatedInstances.helpers

	body = Blaze.toHTMLWithData(Template.related_instances_view, steedosData)

	return body;

InstanceReadOnlyTemplate.getOnLoadScript = (instance)->
	form_version = WorkflowManager.getFormVersion(instance.form, instance.form_version)

	form_script = form_version.form_script;

	if form_script && form_script.replace(/\n/g,"").replace(/\s/g,"").length > 0
		form_script = "CoreForm = {};CoreForm.instanceform = {};" + form_script
		form_script += ";if(CoreForm.form_OnLoad){window.onload = CoreForm.form_OnLoad();}"
	else
		form_script = ""



InstanceReadOnlyTemplate.getInstanceHtml = (user, space, instance, options)->

	body = InstanceReadOnlyTemplate.getInstanceView(user, space, instance, options);

	onLoadScript = InstanceReadOnlyTemplate.getOnLoadScript(instance);

	openFileScript = """
			if(window.isNode && isNode()){
				attachs = document.getElementsByClassName("ins_attach_href");
				for(var i = 0; i < attachs.length; i++){
					attach = attachs[i];
					attach.addEventListener("click", function(e){
						if(isImage(this.dataset.type) || isHtml(this.dataset.type)){
							e.preventDefault();
							openWindow("/api/files/instances/" + this.dataset.id);
						}else if(nw_core.canOpenFile(this.dataset.name)){
							e.preventDefault();
							nw_core.openFile(this.href, this.dataset.name)
						}
					});
				}
			}

			var flow = "#{instance.flow}";
			var space = "#{instance.space}";

	""";


	if !Steedos.isMobile()
		form = db.forms.findOne(instance.form);
		if form?.instance_style == 'table'
			instance_style = "instance-table"

	if options?.templateName == 'table'
		instance_style = "instance-table"

	if options?.instance_style
		instance_style = options.instance_style

	if !options || options.showTrace == true
		trace = InstanceReadOnlyTemplate.getTracesView(user, space, instance)
	else
		trace = ""

	instanceBoxStyle = "";

	if instance && instance.final_decision
		if instance.final_decision == "approved"
			instanceBoxStyle = "box-success"
		else if (instance.final_decision == "rejected")
			instanceBoxStyle = "box-danger"
	if !options || options.showAttachments == true
		attachment = InstanceReadOnlyTemplate.getAttachmentView(user, space, instance)
	else
		attachment = ""

	related_instances = InstanceReadOnlyTemplate.getRelatedInstancesView(user, space, instance, options)

	absoluteUrl = Meteor.absoluteUrl()

	width = "960px"
#	如果给table的parent设置width，则会导致阿里云邮箱显示table 异常
	if options?.width
		width = ""

	cssHref = Meteor.absoluteUrl("steedos-css")

	allCssLink = """<link rel="stylesheet" type="text/css" class="__meteor-css__" href="#{cssHref}">"""

	submit_btn = ""
	instanceTracesStyle = ""

#	if options?.editable
#		submit_btn = '<a class="btn btn-block btn-social btn-steedos-workflow" onclick="wc.submit()"><i class="fa fa-facebook"></i> 提交到审批王</a>'
	if options?.tagger == 'email'
		showTracesBtn = ""
	else
		showTracesBtn = """
			<div class="print-tool">
				<label class="cbx-label"><input type="checkbox" checked class="cbx-print cbx-print-traces" id="cbx-print-traces"/><span>#{t('instance_approval_history')}</span></label>
			</div>
			"""
		instanceTracesStyle = """
			.instance-view .instance-traces{
				padding-left: 15px;
				padding-right: 15px;
			}
		"""

	showTracesScript = """
		$( document ).ready(function(){
			var b = document.getElementById('cbx-print-traces');
			var t = document.getElementsByClassName('instance-traces')[0];
			if (b.checked){
				t.style = 'display: block;'
			} else {
				t.style = 'display: none;'
			}
			b.addEventListener('change', function(e){
				if (e.target.checked){
					t.style = 'display: block;'
				} else {
					t.style = 'display: none;'
				}
			});
		});

	"""

	if options?.styles
		allCssLink = ""

	form = db.forms.findOne({_id: instance.form});
	formDescriptionHtml = ""
	if form
		formDescription = form.description
		if formDescription
			formDescription = formDescription.replace(/\n/g,"<br/>")
			formDescriptionHtml = """
				<div class="box-header  with-border instance-header">
					<div>
						#{formDescription}
					</div>
				</div>
				"""

	html = """
		<!DOCTYPE html>
		<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
				#{allCssLink}
				<script src="https://www.steedos.com/website/libs/jquery.min.js" type="text/javascript"></script>
				<script src="/js/nw_core.js" type="text/javascript"></script>
				#{options.plugins || ""}

				<style>
					.steedos{
						width: #{width};
						margin-left: auto;
						margin-right: auto;
					}

					.instance-view .instance-name{
						display: inline !important
					}
					.box-tools{
						display: none;
					}
					.box.collapsed-box .box-body,.box.collapsed-box .box-footer {
					  display: block;
					}

					body{
						background: azure !important;
					}

					#{instanceTracesStyle}

					#{options?.styles || ""}
				</style>
			</head>
			<body>
				<div class="steedos">
					#{submit_btn}
					#{showTracesBtn}
					<div class="instance-view">
						<div class="instance #{instance_style}">
							<form name="instanceForm">
								<div class="instance-form box #{instanceBoxStyle}">
									#{formDescriptionHtml}
									<div class="box-body">
										<div class="col-md-12">
											#{body}
											#{attachment}
											#{related_instances}
										</div>
									</div>
								</div>
							</form>
							#{trace}
						</div>
					</div>
				</div>
			</body>
			<script>#{openFileScript};#{onLoadScript};#{showTracesScript}</script>
		</html>
	"""

	return html