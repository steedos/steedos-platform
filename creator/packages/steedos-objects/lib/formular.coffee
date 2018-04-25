Creator.Formular = {}

Creator.Formular.PREFIX = "_VALUES"

Creator.Formular._prependPrefixForFormula = (prefix,fieldVariable)->
	reg = /(\{[^{}]*\})/g;

	rev = fieldVariable.replace reg, (m, $1)->
		return prefix + $1.replace(/\{\s*/,"[\"").replace(/\s*\}/,"\"]").replace(/\s*\.\s*/g,"\"][\"");

	return rev

Creator.Formular.checkFormula = (formula_str)->
	if _.isString(formula_str) && formula_str.indexOf("{") > -1 && formula_str.indexOf("}") > -1
		return true
	return false

Creator.Formular.run = (formula_str, _CONTEXT, options)->
	if formula_str && _.isString(formula_str)

		if !_.isBoolean(options?.extend)
			extend = true

		_VALUES = {}
		_VALUES = _.extend(_VALUES, _CONTEXT)
		if extend
			_VALUES = _.extend(_VALUES, Creator.getUserContext(options?.userId, options?.spaceId))
		formula_str = Creator.Formular._prependPrefixForFormula("this", formula_str)

		try
			data = Creator.evalInContext(formula_str, _VALUES)   # 此处不能用window.eval ，会导致变量作用域异常
			return data
		catch e
			console.error("Creator.Formular.run: #{formula_str}", e)
			throw new Meteor.Error 500, "Creator.Formular.run: #{formula_str}#{e}"

	return formula_str
