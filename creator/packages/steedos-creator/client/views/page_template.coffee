Template.page_template.onRendered ->
	this.autorun ()->
		Steedos.Pages.Render(Session.get("pageApiName"))