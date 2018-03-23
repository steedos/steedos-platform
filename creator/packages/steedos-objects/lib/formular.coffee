Creator.Formular = {}
Creator.Formular.USER_CONTEXT = {}

Creator.Formular.PREFIX = "_VALUES"


Meteor.startup ->
	Tracker.autorun ->
		space = Session.get("spaceId")
		userId = Meteor.userId()
		if space and userId and Steedos.subsSpaceBase.ready() && Creator.objects_initialized.get()

			Creator.Formular.USER_CONTEXT.userId = Meteor.userId()
			Creator.Formular.USER_CONTEXT.spaceId = Session.get("spaceId")

			space_user = Creator.getCollection("space_users").findOne({space: space, user: userId})
			if space_user
				Creator.Formular.USER_CONTEXT.user = {
					_id: userId
					name: space_user.name,
					mobile: space_user.mobile,
					position: space_user.position,
					email: space_user.email
					company: space_user.company
				}
				space_user_org = Creator.getCollection("organizations")?.findOne(space_user.organization)

				if space_user_org
					Creator.Formular.USER_CONTEXT.user.organization = {
						_id: space_user_org._id,
						name: space_user_org.name,
						fullname: space_user_org.fullname,
						is_company: space_user_org.is_company
					}

			else
			    #初始化USER_CONTEXT
				Creator.Formular.USER_CONTEXT.user = {}
				Creator.Formular.USER_CONTEXT.organization = {}


Creator.Formular._prependPrefixForFormula = (prefix,fieldVariable)->
	reg = /(\{[^{}]*\})/g;

	rev = fieldVariable.replace reg, (m, $1)->
		return prefix + $1.replace(/\{\s*/,"[\"").replace(/\s*\}/,"\"]").replace(/\s*\.\s*/g,"\"][\"");

	return rev

Creator.Formular.checkFormula = (formula_str)->
	if _.isString(formula_str) && formula_str.indexOf("{") > -1 && formula_str.indexOf("}") > -1
		return true
	return false

Creator.Formular.run = (formula_str, _CONTEXT, extend)->
	if formula_str && _.isString(formula_str)

		if !_.isBoolean(extend)
			extend = true

		_VALUES = {}
		_VALUES = _.extend(_VALUES, _CONTEXT)
		if extend
			_VALUES = _.extend(_VALUES, Creator.Formular.USER_CONTEXT)
		formula_str = Creator.Formular._prependPrefixForFormula("this", formula_str)

		try
			data = Creator.evalInContext(formula_str, _VALUES)   # 此处不能用window.eval ，会导致变量作用域异常
			return data
		catch e
			console.error("Creator.Formular.run: #{formula_str}", e)

	return formula_str
