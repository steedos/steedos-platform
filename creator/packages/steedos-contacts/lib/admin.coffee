db.address_groups.adminConfig = 
	icon: "globe"
	color: "blue"
	tableColumns: [
		{name: "name"},
	]
	routerAdmin: "/contacts"

db.address_books.adminConfig = 
	icon: "globe"
	color: "blue"
	tableColumns: [
		{name: "group_name()"},
		{name: "name"},
		{name: "email"}
	]
	extraFields: ["group"]
	selector: {owner: -1}
	routerAdmin: "/contacts"

Meteor.startup ->

	@address_groups = db.address_groups
	AdminConfig?.collections_add
		address_groups: db.address_groups.adminConfig


	@address_books = db.address_books
	AdminConfig?.collections_add
		address_books: db.address_books.adminConfig


if Meteor.isClient
	Meteor.startup ->
		Tracker.autorun ->
			if Meteor.userId()
				AdminTables["address_groups"]?.selector = {owner: Meteor.userId()}
				AdminTables["address_books"]?.selector = {owner: Meteor.userId()}



	

