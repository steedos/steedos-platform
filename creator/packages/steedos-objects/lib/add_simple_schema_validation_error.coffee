SimpleSchema.RegEx.code = new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$')

if Meteor.isClient
	Meteor.startup ()->
		_regExMessages = SimpleSchema._globalMessages.regEx || []
		_regExMessages.push {exp: SimpleSchema.RegEx.code, msg: "[label] 只能以字母、_开头，且只能包含字母、数字、_"}
		SimpleSchema.messages({
			regEx: _regExMessages,
		})