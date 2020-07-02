AutoForm.addInputType 'typeahead',
	template: 'afTypeAhead'
	valueIn: (val, atts) ->
		return val
	valueOut: ->
		return this.val()

	valueConverters:
		'stringArray': AutoForm.valueConverters.stringToStringArray
		'number': AutoForm.valueConverters.stringToNumber
		'numerArray': AutoForm.valueConverters.stringToNumberArray
		'boolean': AutoForm.valueConverters.stringToBoolean
		'booleanArray': AutoForm.valueConverters.stringToBooleanArray
		'date': AutoForm.valueConverters.stringToDate
		'dateArray': AutoForm.valueConverters.stringToDateArray
	contextAdjust: (context) ->
		if typeof context.atts.maxlength == 'undefined' and typeof context.max == 'number'
			context.atts.maxlength = context.max
		context.atts.class = 'typeahead form-control'
		return context

Template.afTypeAhead.helpers

Template.afTypeAhead.events

Template.afTypeAhead.onRendered ->

	options = @data.selectOptions

	id = @data.atts.id

	name = @data.name

	substringMatcher = (options) ->
		(q, cb) ->
			matches = []
			if q
				substrRegex = new RegExp(q, 'i')
				$.each options, (i, option) ->
					if substrRegex.test(option)
						matches.push option
					return
				cb matches
			else
				cb options

	$('#' + id).typeahead {
		hint: false
		highlight: true
		minLength: 0
	},
		name: name
		limit: 10
		source: substringMatcher(options.getProperty("label"))