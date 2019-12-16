steedosExport = {}

_getFlowByForm = (form, flowId, is_copy, company_id)->

	query = {form: form}

	if flowId
		query._id = flowId

	fields = {history: 0}

	flows = db.flows.find(query, fields).fetch();

	flows.forEach (flow) ->
		flow.historys = []
		if !is_copy || (!company_id && flow.company_id) || (company_id && !flow.company_id) || (company_id != flow.company_id)
			flow.current.steps?.forEach (step) ->
				roles_name = []
				if !_.isEmpty(step.approver_roles)
					roles_name = db.flow_roles.find({_id: {$in: step.approver_roles}}, {fields: {name: 1}}).fetch().getProperty("name");

				step.approver_roles_name = roles_name

				hr_roles_name = []
				if !_.isEmpty(step.approver_hr_roles)
					hr_roles_name = db.roles.find({_id: {$in: step.approver_hr_roles}}, {fields: {name: 1}}).fetch().getProperty("name");
				step.approver_hr_roles_name = hr_roles_name

				step.approver_users = []

				step.approver_orgs = []

		if !is_copy || (!company_id && flow.company_id) || (company_id && !flow.company_id) || (company_id != flow.company_id)
			delete flow.perms

	return flows;

###
    获取form对象

    category: form的分组名次

    form：不包含历史版本

    instance_number_rules: 表单字段所引用的编号规则

    flows: 引用此表单的所有流程，不包含历史版本
###
steedosExport.form = (formId, flowId, is_copy, company_id) ->
	form = db.forms.findOne({_id: formId}, {fields: {historys: 0}});

	if !form
		return {}

	form.historys = []

	if form?.category
		category = db.categories.findOne({_id: form.category}, {fields: {name: 1}});

		if category?.name
			form.category_name = category.name

	_getNumberRuleName = (str)->
		if _.isString(str) && str?.indexOf("auto_number(") > -1
			str = str.replace("auto_number(", "").replace(")", "").replace("\"", "").replace("\"", "").replace("\'", "").replace("\'", "")
			return str
		return ;

	instance_number_rules = new Array()

	if form.current

		fields = new Array()

		c_fields = form.current.fields

		c_fields?.forEach (f)->
			if f.type == 'table'
				console.log 'ignore table field'
			else if f.type == 'section'
				f?.fields?.forEach (f1)->
					fields.push f1
			else
				fields.push f

		_getFieldNumberRule = (spaceId, instance_number_rules, str)->
			number_rule_name = _getNumberRuleName(str)

			if number_rule_name
				number_rule = db.instance_number_rules.findOne({space: spaceId, name: number_rule_name}, {fields: {_id: 1, name: 1, year: 1, first_number: 1, rules: 1}})

				number_rule.number = 0

				if !instance_number_rules.findPropertyByPK("_id", number_rule._id)

					delete number_rule._id

					instance_number_rules.push(number_rule)

			return instance_number_rules


		fields.forEach (f)->
			_getFieldNumberRule(form.space, instance_number_rules, f.default_value)

			_getFieldNumberRule(form.space, instance_number_rules, f.formula)

	form.instance_number_rules = instance_number_rules

	form.flows = _getFlowByForm(formId, flowId, is_copy, company_id)

	return form