###
admin_menus：
{
	_id: xxx
	title: "Steedos Workflow"
	icon:""
	url: ""
	target: "xx"
	onclick: ->
	app: "workflow"
	paid : true
	mobile: true
	roles:["space_admin", "space_owner", "cloud_admin"]
	sort: 30
	parent: parentId
}
### 


db.admin_menus = new Meteor.Collection()

Steedos.addAdminMenu = (menu)->
	unless menu
		return false
	unless typeof menu._id == "string"
		return false
	return db.admin_menus.insert menu