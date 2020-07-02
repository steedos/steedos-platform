@FormulaEngine = {}

FormulaEngine.PREFIX = "_VALUES"

FormulaEngine.context = ()->

	space = Session.get("spaceId")

	userId = Meteor.userId()

	context = {}

	if userId

		context.userId = Meteor.userId()
		context.spaceId = Session.get("spaceId")

		space_user = db.space_users.findOne({space: space, user: userId})
		context.user = {
			_id: userId
			name: space_user.name,
			mobile: space_user.mobile,
			position: space_user.position,
			email: space_user.email
		}

		if space_user
			space_user_org = db.organizations.findOne(space_user.organization)

			if space_user_org
				context.user.organization = {
					_id: space_user_org._id,
					name: space_user_org.name,
					fullname: space_user_org.fullname
				}

	return context;

FormulaEngine._prependPrefixForFormula = (prefix,fieldVariable)->
	reg = /(\{[^{}]*\})/g;

	rev = fieldVariable.replace reg, (m, $1)->
		return prefix + $1.replace(/\{\s*/,"[\"").replace(/\s*\}/,"\"]").replace(/\s*\.\s*/g,"\"][\"");

	return rev

FormulaEngine.checkFormula = (formula_str)->
	if _.isString(formula_str) && formula_str.indexOf("{") > -1 && formula_str.indexOf("}") > -1
		return true
	return false

FormulaEngine.run = (formula_str, _CONTEXT, extend)->
	if formula_str && _.isString(formula_str)

		if !_.isBoolean(extend)
			extend = true

		if extend
			_VALUES = FormulaEngine.context();
			_VALUES = _.extend(_VALUES, _CONTEXT)
		else
			_VALUES = _CONTEXT
		formula_str = FormulaEngine._prependPrefixForFormula("this", formula_str)

		# formula_data_str = "#{FormulaEngine.PREFIX} = FormulaEngine.context();";

		# if extend
		# 	formula_data_str = formula_data_str + "_.extend(#{FormulaEngine.PREFIX}, _CONTEXT);"
		# else
		# 	formula_data_str =  "#{FormulaEngine.PREFIX} = _CONTEXT;"

		# formula_str = FormulaEngine._prependPrefixForFormula(FormulaEngine.PREFIX, formula_str)

		try
			data = Creator.evalInContext(formula_str, _VALUES)   # 此处不能用window.eval ，会导致变量作用域异常
			return data
		catch e
			console.error("FormulaEngine.run: #{formula_str}", e)

	return formula_str
