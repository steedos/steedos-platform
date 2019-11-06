TemplateManager = {};

formId = 'instanceform';


TemplateManager.instance_title = ()->
	pageTitle = """
		{{instance.name}}
	"""

	pageTitleTrClass = "instance-name"

	if CoreForm?.pageTitleFieldName
		pageTitle = """
				{{> afFormGroup name="#{CoreForm.pageTitleFieldName}" label=false}}
		"""
		pageTitleTrClass = ""

	if CoreForm?.pageTitle
		pageTitle = """
			#{CoreForm.pageTitle}
		"""
		pageTitleTrClass = ""

	val =
		pageTitle: pageTitle
		pageTitleTrClass: pageTitleTrClass

	return val

TemplateManager.handleTableTemplate = (instance, _export) ->

	template = """
	<div class='instance-template'>
		<table class="table-page-title form-table no-border text-align-center" style="width: 100%;display: inline-table;">
			<tr class="#{this.instance_title().pageTitleTrClass}">
				<td class="instance-table-name-td page-title">
					#{this.instance_title().pageTitle}
				</td>
			</tr>

		</table>
		<table class="table-page-body form-table">
				<tr style="height:0px">
					<th style='width: 16%'></th>
					<th></th>
					<th style='width: 16%'></th>
					<th></th>
				</tr>
	""";

	table_fields = InstanceformTemplate.helpers.table_fields(instance)

	table_fields.forEach (table_field)->

		required = ""
		if !CoreForm?.pageTitleFieldName || CoreForm?.pageTitleFieldName != table_field.code
			if table_field.is_required
				required = "is-required"

			if _export
				required = "";

			pureCode = Steedos.removeSpecialCharacter(table_field.code);

			if InstanceformTemplate.helpers.isOpinionField(table_field)
				template += table_field.tr_start
				template += """
					<td class="td-title #{required}">
						{{afFieldLabelText name="#{table_field.code}"}}
					</td>
					<td class="td-field opinion-field opinion-field-#{pureCode} automatic" colspan = "#{table_field.td_colspan}">
						{{> instanceSignText name="#{table_field.code}"}}
					</td>
				"""
				template += table_field.tr_end
			else
				if InstanceformTemplate.helpers.includes(table_field.type, 'section,table')
					template += table_field.tr_start
					template += """
						<td class="td-childfield td-childfield-#{pureCode}" colspan = "#{table_field.td_colspan}">
						   {{> afFormGroup name="#{table_field.code}" label=false}}
						</td>
					"""
					template += table_field.tr_end
				else
					template += table_field.tr_start

					if _export
						title_permission = ""
						field_permission = ""
					else
						title_permission = "title-" + table_field.permission
						field_permission = "field-" + table_field.permission

					template += """
						<td class="td-title td-title-#{pureCode} #{title_permission} #{required}">
							{{afFieldLabelText name="#{table_field.code}"}}
						</td>
						<td class="td-field td-field-#{pureCode} #{field_permission}" colspan = "#{table_field.td_colspan}">
							{{> afFormGroup name="#{table_field.code}" label=false}}
						</td>
					"""
					template += table_field.tr_end

	template += """
		</table>

		<table class="table-page-footer form-table no-border">
			<tr class="applicant-wrapper">
				<td class="nowrap">
					<div class='inline-left'>
						<label class="control-label">{{_t "instance_initiator"}}：</label>
					</div>
					<div class='instance-table-wrapper-td inline-left'>
						{{>Template.dynamic  template="afSelectUser" data=applicantContext}}
					</div>
				</td>
				<td class="nowrap">
					<div class='pull-left'>
						<div class='inline-left'>
							<label>{{_t "instance_submit_date"}}：</label>
						</div>
						<div class='inline-right'>
							<div class="form-group">
								{{formatDate instance.submit_date '{"format":"YYYY-MM-DD"}'}}
							</div>
						</div>
					</div>
				</td>
			</tr>
		</table>
	</div>
	"""
	return template

#此处模板公用与：instance 编辑、查看、打印、转发时生成附件、发送邮件body部分(table 模板)
#如果有修改，请测试确认其他功能是否正常。
TemplateManager._template =
	default: (instance)->

		template = """
			<div class="with-border col-md-12">
				<div class="instance-name">
					<h3 class="box-title">#{TemplateManager.instance_title().pageTitle}</h3>
					<span class="help-block"></span>
				</div>
				<span class="help-block"></span>
			</div>
			{{#each steedos_form.fields}}
				{{#if isOpinionField this}}
					<div class="{{#if this.is_wide}}col-md-12{{else}}col-md-6{{/if}} field-{{this.code}}">
						<div class="form-group automatic opinion-field-{{this.code}}">
							<label class="control-label">{{afFieldLabelText name=this.code}}</label>

							{{> instanceSignText name=this.code}}
						</div>
					</div>
				{{else}}
					{{#if includes this.type 'section,table'}}
						<div class="col-md-12 field-{{this.code}}">
							{{> afFormGroup name=this.code label=false}}
						</div>
					{{else}}
						<div class="{{#if this.is_wide}}col-md-12{{else}}col-md-6{{/if}} field-{{this.code}}">
						{{> afFormGroup name=this.code}}
						</div>
					{{/if}}
				{{/if}}
			{{/each}}
			<div class="col-md-12">
				<div class="applicant-wrapper form-group form-horizontal">
				<div class="input-group">
					<div class="input-group-addon">
					  {{_t "instance_initiator"}}&nbsp;:
					</div>
					{{>Template.dynamic  template="afSelectUser" data=applicantContext}}
				  </div>
				</div>
			</div>
		"""
		return template

	table: (instance)->
		return TemplateManager.handleTableTemplate(instance)
#	table: '''
#		<table class="box-header  with-border" style="width: 100%;display: inline-table;">
#			<tr class="instance-name">
#				<td class="instance-table-name-td">
#					<h3 class="box-title">{{instance.name}}</h3>
#					<span class="help-block"></span>
#				</td>
#			</tr>
#            <tr class="applicant-wrapper">
#				<td class="instance-table-wrapper-td">
#					<label class="control-label">{{_t "instance_initiator"}}&nbsp;:</label>
#					{{>Template.dynamic  template="afSelectUser" data=applicantContext}}
#				</td>
#			</tr>
#        </table>
#		<table class="form-table">
#		    {{#each table_fields}}
#				{{#if isOpinionField this}}
#					{{{tr_start}}}
#						<td class="td-title {{#if is_required}}is-required{{/if}}">
#							{{afFieldLabelText name=this.code}}
#						</td>
#						<td class="td-field opinion-field" colspan = '{{td_colspan}}'>
#							{{> instanceSignText step=(getOpinionFieldStepName this) default=''}}
#						</td>
#					{{{tr_end}}}
#				{{else}}
#					{{#if includes this.type 'section,table'}}
#						{{{tr_start}}}
#							<td class="td-childfield" colspan = '{{td_colspan}}'>
#							   {{> afFormGroup name=this.code label=false}}
#							</td>
#						{{{tr_end}}}
#					{{else}}
#						{{{tr_start}}}
#							<td class="td-title {{#if is_required}}is-required{{/if}}">
#								{{afFieldLabelText name=this.code}}
#							</td>
#							<td class="td-field {{permission}}" colspan = '{{td_colspan}}'>
#								{{> afFormGroup name=this.code label=false}}
#							</td>
#						{{{tr_end}}}
#					{{/if}}
#				{{/if}}
#
#		    {{/each}}
#		</table>
#	'''

TemplateManager._templateHelps =
	applicantContext: ->
		steedos_instance = WorkflowManager.getInstance();
		data = {
			name: 'ins_applicant',
			atts: {
				name: 'ins_applicant',
				id: 'ins_applicant',
				class: 'selectUser form-control',
				style: 'padding:6px 12px;width:140px;display:inline'
			}
		}
#		if not steedos_instance || steedos_instance.state != "draft"
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
	obj["formId"] = formId;
	return obj;

instance: ->
	Session.get("change_date")
	if (Session.get("instanceId"))
		steedos_instance = WorkflowManager.getInstance();
		return steedos_instance;

equals: (a, b) ->
	return (a == b)

includes: (a, b) ->
	return b.split(',').includes(a);

fields: ->
	form_version = WorkflowManager.getInstanceFormVersion();
	if form_version
		return new SimpleSchema(WorkflowManager_format.getAutoformSchema(form_version));

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


TemplateManager.getTemplate = (instance, templateName) ->
	flow = db.flows.findOne(instance.flow);
	form = db.forms.findOne(instance.form);

	if templateName
		if templateName == 'table'
			return TemplateManager._template.table(instance)
		return TemplateManager._template.default(instance)

	if Session?.get("instancePrint")
		if flow?.print_template
			return "<div class='instance-template'>" + flow.print_template + "</div>"
		else
			if flow?.instance_template
				return "<div class='instance-template'>" + flow.instance_template + "</div>"
			else
				return TemplateManager._template.table(instance)
	else
		if Steedos.isMobile()
			return TemplateManager._template.default(instance)

		if flow?.instance_template
			return "<div class='instance-template'>" + flow.instance_template + "</div>"

		if form?.instance_style
			if form.instance_style == 'table'
				return TemplateManager._template.table(instance)
			return TemplateManager._template.default(instance)
		else
			return TemplateManager._template.default(instance)

#TemplateManager.exportTemplate = (flowId) ->
#	template = TemplateManager.getTemplate(flowId);
#
#	flow = WorkflowManager.getFlow(flowId);
#
#	if flow?.instance_template
#		return template;
#
#	return template;

