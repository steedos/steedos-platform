
#SimpleSchema._globalMessages.precisionExp = "长度不能超过[value]"

AutoForm.addInputType 'steedosNumber', {
	template: "afSteedosNumber"
	valueIn: (val, atts)->
		if val
			return Number(val).toFixed(atts.scale)
		else
			return 0.toFixed(atts.scale)
	valueOut: ()->
		return AutoForm.valueConverters.stringToNumber(this.val())
	valueConverters: {
		"string": AutoForm.valueConverters.numberToString
		"stringArray": AutoForm.valueConverters.numberToStringArray
		"numberArray": AutoForm.valueConverters.numberToNumberArray
		"boolean": AutoForm.valueConverters.numberToBoolean
		"booleanArray": AutoForm.valueConverters.numberToBooleanArray
	}
	contextAdjust: (context)->

		_scale = context.atts.scale || 0

		if typeof context.atts.max == "undefined" && typeof context.max == "number"
			context.atts.max = context.max
		if typeof context.atts.min == "undefined" && typeof context.min == "number"
			context.atts.min = context.min
		if typeof context.atts.step == "undefined" && _.isNumber(_scale) && _scale > 0
			step = "0.";
			_.range(_scale).forEach (_i,index)->
				if index == _scale - 1
					s = s + "1"
				else
					s = s + "0"
			context.atts.step = step

		context.atts.class = "form-control"

		context.precision = context.atts.precision
		context.scale = context.atts.scale

		return context
}

_format = (val, key, precision, scale)->
	formId = AutoForm.getFormId()
	_val = new Number(val)
	if val.indexOf(".") > -1
		if val.length - 1 > precision
			return Number(val.substring(0,precision - scale - 1)).toFixed(scale)
#			AutoForm.addStickyValidationError(formId, key, "precisionExp", [precision + "位"])
		else
#			AutoForm.removeStickyValidationError(formId, key)
			return _val.toFixed(scale)
	else
		if val.length  > precision
			return Number(val.substring(0,precision - scale)).toFixed(scale)
#			AutoForm.addStickyValidationError(formId, key, "precisionExp", [precision + "位"])
		else
#			AutoForm.removeStickyValidationError(formId, key)
			return _val.toFixed(scale)

Template.afSteedosNumber.events
	'blur input[type=number]': (e, t)->
		e.currentTarget.value = _format(e.currentTarget.value, this.atts.name, this.atts.precision, this.atts.scale)
	
	'keydown input[type=number]': (e, t)->
		scale = this.atts.scale || 0
		currentValue = e.currentTarget.value
		unless currentValue
			return true
		if /\./.test(e.key)
			# 不能输入.连接符号
			if scale == 0
				return false
			# 不能输入两个.连接符号
			if /\./.test(currentValue)
				return false
		else if !/\d/.test(e.key) and !_.include([8,46,37,38,39,40,27],e.keyCode)
			# 只能输入数字或退格、删除、方向键、esc
			return false