linesToArray = (text) ->
	text = text.split('\n')
	lines = []
	_.each text, (line) ->
		line = $.trim(line)
		if line.length
			lines.push line
		return
	lines

AutoForm.addInputType 'autosizearea',
	template: 'afAutosizearea'
	valueConverters:
		'stringArray': (val) ->
			if typeof val == 'string' and val.length > 0
				return linesToArray(val)
			val
		'number': AutoForm.valueConverters.stringToNumber
		'numberArray': AutoForm.valueConverters.stringToNumberArray
		'boolean': AutoForm.valueConverters.stringToBoolean
		'booleanArray': (val) ->
			if typeof val == 'string' and val.length > 0
				arr = linesToArray(val)
				return _.map(arr, (item) ->
					AutoForm.valueConverters.stringToBoolean item
				)
			val
		'date': AutoForm.valueConverters.stringToDate
		'dateArray': (val) ->
			if typeof val == 'string' and val.length > 0
				arr = linesToArray(val)
				return _.map(arr, (item) ->
					AutoForm.valueConverters.stringToDate item
				)
			val
	contextAdjust: (context) ->
		if typeof context.atts.maxlength == 'undefined' and typeof context.max == 'number'
			context.atts.maxlength = context.max
		context

Template.afAutosizearea.onRendered ()->
	Meteor.defer ()->
		Meteor.setTimeout ()->
			autosize($("[data-autosize='enable']"));
		, 300

