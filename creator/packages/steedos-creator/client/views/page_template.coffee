Template.page_template.onRendered ->
	self = this;
	this.autorun ()->
		Steedos.Page.App.render(self, Session.get("pageApiName"), Session.get("app_id"))