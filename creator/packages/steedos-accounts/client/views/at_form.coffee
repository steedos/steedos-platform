Template.atForm.onRendered ->
	this.autorun ->
		$("#at-field-username_and_email").attr("autocomplete", "off")