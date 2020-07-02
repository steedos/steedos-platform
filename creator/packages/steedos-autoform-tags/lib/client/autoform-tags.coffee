AutoForm.addInputType 'tags',
	template: 'autoformTags'
	valueOut: ->
		@val()
	valueConverters:
		stringArray: (value) ->
			value.split ','

Template.autoformTags.created = ->
	self = @
	self.value = new ReactiveVar

	@_stopInterceptValue = false
	@_interceptValue = (ctx) ->
		if ctx.value and not self._stopInterceptValue
			self.value.set ctx.value
			self._stopInterceptValue = true

Template.autoformTags.rendered = ->
	require('bootstrap-tagsinput');
	
	self = @$ '.js-input'

	self.closest('form').on 'reset', ->
		self.tagsinput 'removeAll'

	self.tagsinput @data.atts
	@autorun =>
		value = @value.get()
		if $.isArray value
			self.val(value.join ',')
		if typeof value is 'string'
			self.val value

Template.autoformTags.helpers
	schemaKey: ->
		@atts['data-schema-key']
	value: ->
		Template.instance()._interceptValue @
		Template.instance().value.get()
