Template.page_template.onRendered ->
	self = this;
	pageName = Session.get("pageApiName");
	appId = Session.get("app_id")
	this.autorun ()->
		Steedos.Page.App.render(self, pageName, appId)