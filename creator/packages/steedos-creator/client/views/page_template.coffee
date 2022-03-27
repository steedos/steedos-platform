Template.page_template.onRendered ->
	self = this;
	appId = Session.get("app_id")
	this.autorun ()->
		Steedos.Page.App.render(self, Session.get("pageApiName"), appId)