SimpleSchema.RegEx.field = new RegExp('^[a-zA-Z_]\\w*(\\.\\$\\.\\w+)?[a-zA-Z0-9]*$')

if Meteor.isClient
	Meteor.startup ()->
		_regExMessages = SimpleSchema._globalMessages.regEx || []
		_regExMessages.push {exp: SimpleSchema.RegEx.field, msg: "[label] 只能以字母、_开头，.$.前后必须包含字符"}
		SimpleSchema.messages({
			regEx: _regExMessages,
		})