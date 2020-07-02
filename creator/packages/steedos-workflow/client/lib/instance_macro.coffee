###
支持的脚本为：
    当前时间：now
    申请人：applicant.name, applicant.organization, applicant.organizations, applicant.hr
    处理人：approver.name, approver.organization, approver.organizations, applicant.hr
###

InstanceMacro.check = (macro) ->
	if _.isString(macro) && macro.indexOf("{") > -1 && macro.indexOf("}") > -1 && macro.indexOf("auto_number(") < 0
		return true;
	return false



InstanceMacro.run = (macro) ->

	if _.isFunction(macro)
		try
			return macro();
		catch e
			console.log "InstanceMacro.run error." , e
			return ;


	form_version = WorkflowManager.getInstanceFormVersion();

	_context = Form_formula.init_formula_values(form_version.fields, {});

	_context.now = new Date()

	try

		if InstanceMacro.check(macro)

			macro = Form_formula.prependPrefixForFormula("_context", macro)

			return eval(macro)
	catch  e

		console.log "InstanceMacro.run error." , e

		return ;