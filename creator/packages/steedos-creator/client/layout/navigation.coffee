Template.creatorNavigation.helpers Creator.helpers

Template.creatorNavigation.helpers
	
	app_id: ()->
		return Session.get("app_id")

	app_name: ()->
		app = Creator.getApp()
		return app?.name

	app_objects: ()->
		app = Creator.getApp()

		objects = []
		if app
			_.each app.objects, (v)->
				obj = Creator.getObject(v)
				if obj.permissions.get().allowRead
					objects.push v
		return objects

	object_i: ()->
		return Creator.getObject(this)

	object_class_name: (obj)->
		if (obj == FlowRouter.getParam("object_name"))
			return "slds-is-active"

	object_url: ()->
		return Creator.getObjectUrl(this, null)

	spaces: ->
		return db.spaces.find();

	spaceName: ->
		if Session.get("spaceId")
			space = db.spaces.findOne(Session.get("spaceId"))
			if space
				return space.name
		return t("none_space_selected_title")

	spacesSwitcherVisible: ->
		return db.spaces.find().count()>1;

	displayName: ->
		if Meteor.user()
			return Meteor.user().displayName()
		else
			return " "

	avatar: () ->
		return Meteor.user()?.avatar

	avatarURL: (avatar,w,h,fs) ->
		return Steedos.absoluteUrl("avatar/#{Meteor.userId()}?w=#{w}&h=#{h}&fs=#{fs}&avatar=#{avatar}");

	isNode: ()->
		return Steedos.isNode()

Template.creatorNavigation.events

	"click .switchSpace": ->
		Steedos.setSpaceId(this._id)
		# 获取路由路径中第一个单词，即根目录
		rootName = FlowRouter.current().path.split("/")[1]
		FlowRouter.go("/#{rootName}")

	'click .app-list-btn': (event)->
		Modal.show("creator_app_list_modal")
	
	'click .header-refresh': (event)->
		window.location.reload(true)
