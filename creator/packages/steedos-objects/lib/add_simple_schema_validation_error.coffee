SimpleSchema.RegEx.code = new RegExp('^[a-zA-Z_][a-zA-Z0-9_]*$')
# 原来的SimpleSchema.RegEx.Url未能识别内网ip格式
SimpleSchema.RegEx.Url = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i

if Meteor.isClient
	Meteor.startup ()->
		_regExMessages = SimpleSchema._globalMessages.regEx || []
		_regExMessages.push {exp: SimpleSchema.RegEx.code, msg: "[label] 只能以字母、_开头，且只能包含字母、数字、_"}
		SimpleSchema.messages({
			regEx: _regExMessages,
		})