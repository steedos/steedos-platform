@FormulaEngine = {}

FormulaEngine.PREFIX = "_VALUES"

FormulaEngine.baseData = ()->

	space = Session.get("spaceId")

	userId = Meteor.userId()

	baseData = {}

	if userId

		baseData.userId = Meteor.userId()
		baseData.spaceId = Session.get("spaceId")

		user = db.users.findOne(userId)

		if user
			baseData.user = {
				_id: user._id
				name: user.name,
				mobile: user.mobile,
				position: user.position,
				email: user.email
			}

			space_user = db.space_users.findOne({space: space, user: user._id})

			if space_user
				space_user_org = db.organizations.findOne(space_user.organization)

				if space_user_org
					baseData.user.organization = {
						_id: space_user_org._id,
						name: space_user_org.name,
						fullname: space_user_org.fullname,
						is_company: space_user_org.is_company
					}

	return baseData;

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

		formula_data_str = "#{FormulaEngine.PREFIX} = FormulaEngine.baseData();";

		if extend
			formula_data_str = formula_data_str + "_.extend(#{FormulaEngine.PREFIX}, _CONTEXT);"
		else
			formula_data_str =  "#{FormulaEngine.PREFIX} = _CONTEXT;"

		formula_str = FormulaEngine._prependPrefixForFormula(FormulaEngine.PREFIX, formula_str)

		try
			data = eval(formula_data_str + formula_str)
			return data
		catch e
			console.error("FormulaEngine.run: #{formula_str}", e)

	return formula_str
