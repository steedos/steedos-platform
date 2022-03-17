Template.page_template.onRendered ->
	this.autorun ()->
		Steedos.Page.App.render(Session.get("pageApiName"))