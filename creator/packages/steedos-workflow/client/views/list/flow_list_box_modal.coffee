Template.flow_list_box_modal.helpers
	title: ()->
		title = Template.instance().data?.title
		if title
			return title
		else
			return t "Fill in form"
	
	help_url: ()->
		helpUrl = Template.instance().data?.helpUrl
		if helpUrl
			return helpUrl
		else
			return null


Template.flow_list_box_modal.onRendered ->

Template.flow_list_box_modal.events
	'click #btn_help': (event, template) ->
		helpUrl = template.data?.helpUrl
		if helpUrl
			Steedos.openWindow helpUrl

	'hide.bs.modal #flow_list_box_modal': (event, template) ->
		Modal.allowMultiple = false;
		return true;