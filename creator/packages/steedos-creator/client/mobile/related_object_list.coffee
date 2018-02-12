initFilter = (object_name, related_object_name, record_id) ->
	spaceId = Steedos.spaceId()
	userId = Meteor.userId()
	related_lists = Creator.getRelatedList(object_name, record_id)
	related_field_name = ""
	selector = []
	_.each related_lists, (obj)->
		if obj.object_name == related_object_name
			related_field_name = obj.related_field_name
	
	related_field_name = related_field_name.replace(/\./g, "/")

	if related_object_name == "cfs.files.filerecord"
		selector.push(["metadata/space", "=", spaceId])
	else
		selector.push(["space", "=", spaceId])

	if related_object_name == "cms_files"
		selector.push("and", ["parent/o", "=", object_name])
		selector.push("and", ["parent/ids", "=", record_id])
	else
		selector.push("and", [related_field_name, "=", record_id])
	
	permissions = Creator.getPermissions(related_object_name, spaceId, userId)
	if !permissions.viewAllRecords and permissions.allowRead
		selector.push("and", ["owner", "and", userId])

	return selector

displayListGrid = (app_id, object_name, related_object_name, record_id, icon, name_field_key)->
	url = "/api/odata/v4/#{Steedos.spaceId()}/#{related_object_name}"
	filter = initFilter(object_name, related_object_name, record_id)
	console.log filter
	self.$("#relatedObjectRecords").dxList({
		dataSource: {
			store: {
				type: "odata",
				version: 4,
				url: Steedos.absoluteUrl(url)
				withCredentials: false,
				beforeSend: (request) ->
					request.headers['X-User-Id'] = Meteor.userId()
					request.headers['X-Space-Id'] = Steedos.spaceId()
					request.headers['X-Auth-Token'] = Accounts._storedLoginToken()
				onLoading: (loadOptions)->
					console.log loadOptions
					return

			},
			select: [
				name_field_key, "_id"
			],
			filter: filter
		},
		height: "auto"
		searchEnabled: true
		searchExpr: name_field_key,
		pageLoadMode: "scrollBottom"
		pullRefreshEnabled: true
		itemTemplate: (data, index)->
			record_url = Creator.getObjectUrl(related_object_name, data._id, app_id)
			result = $("<a>").addClass("weui-cell weui-cell_access weui-cell-profile record-item").attr("href", record_url)
			$("<div>").html(Blaze.toHTMLWithData Template.steedos_icon, {class: "slds-icon slds-page-header__icon", source: "standard-sprite", name: icon}).addClass("weui-cell__hd").appendTo(result)
			$("<div>").html("<p>#{data[name_field_key]}</p>").addClass("weui-cell__bd weui-cell_primary").appendTo(result)
			return result
	});

Template.relatedObjectList.onRendered ->
	self = this

	self.$(".related-object-list").removeClass "hidden"
	self.$(".related-object-list").animateCss "fadeInRight"

	app_id = Template.instance().data.app_id
	object_name = Template.instance().data.object_name
	related_object_name = Template.instance().data.related_object_name
	record_id = Template.instance().data.record_id
	icon = Creator.getObject(related_object_name).icon
	name_field_key = Creator.getObject(related_object_name).NAME_FIELD_KEY

	self.autorun (c)->
		if Steedos.spaceId()
			c.stop()
			displayListGrid(app_id, object_name, related_object_name, record_id, icon, name_field_key)

	self.autorun (c)->
		if Session.get("reload_dxlist")
			self.$("#relatedObjectRecords").dxList("reload")

Template.relatedObjectList.helpers Creator.helpers

Template.relatedObjectList.helpers
	related_object_name: ()->
		return Template.instance().data.related_object_name

	related_object_label: ()->
		related_object_name = Template.instance().data.related_object_name
		return Creator.getObject(related_object_name).label
	
	collectionName: ()->
		related_object_name = Template.instance().data.related_object_name
		return Creator.getObject(related_object_name).label
	
	collection: ()->
		related_object_name = Template.instance().data.related_object_name
		return "Creator.Collections." + related_object_name

Template.relatedObjectList.events
	'click .related-object-list-back': (event, template)->
		lastUrl = urlQuery[urlQuery.length - 2]
		urlQuery.pop()
		template.$(".related-object-list").animateCss "fadeOutRight", ->
			Blaze.remove(template.view)         
			if lastUrl
				FlowRouter.go lastUrl
			else
				FlowRouter.go '/app/menu'

	'click .add-related-item': (event, template)->
		record_id = Template.instance().data.record_id
		object_name = Template.instance().data.object_name
		related_object_name = Template.instance().data.related_object_name
		related_lists = Creator.getRelatedList(object_name, record_id)
		related_field_name = _.findWhere(related_lists, {object_name: related_object_name}).related_field_name
		if related_field_name
			Session.set 'cmDoc', {"#{related_field_name}": record_id}

		Session.set("reload_dxlist", false)
		template.$(".btn-add-related-item").click()

AutoForm.hooks addRelatedItem:
	onSuccess: (formType, result)->
		Session.set("reload_dxlist", true)
		record_id = result
		app_id = FlowRouter._current.params.app_id
		related_object_name = FlowRouter._current.params.related_object_name
		record_url = Creator.getObjectUrl(related_object_name, record_id, app_id)
		FlowRouter.go record_url