db.cms_pages = new Meteor.Collection('cms_pages')

db.cms_pages._simpleSchema = new SimpleSchema
	site: 
		type: String,
		autoform: 
			type: "hidden",
			defaultValue: ->
				return Session.get("siteId");
	title: 
		type: String,
	slug:
		type: String,
		optional: true
	content: 
		type: String,
		autoform: 
			rows: 10
	order: 
		type: Number,
		optional: true

	created: 
		type: Date,
		optional: true
	created_by:
		type: String,
		optional: true
	modified:
		type: Date,
		optional: true
	modified_by:
		type: String,
		optional: true

		
if Meteor.isClient
	db.cms_pages._simpleSchema.i18n("cms_pages")

db.cms_pages.attachSchema(db.cms_pages._simpleSchema)


db.cms_pages.adminConfig = 
	icon: "globe"
	color: "blue"
	tableColumns: [
		{name: "title"},
		{name: "modified"},
	]
	selector: {owner: -1}
	routerAdmin: "/cms/admin"

