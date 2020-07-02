Template.space_switcher.helpers

	isOnlyOneSpace: ->
		return db.spaces.find().fetch().length <= 1

	spaces: ->
		return db.spaces.find();

	spaceName: ->
		if Session.get("spaceId")
			space = db.spaces.findOne(Session.get("spaceId"))
			if space
				return space.name
		return t("none_space_selected_title")

	isNeedToShowRedDot: ()->
		currentSpaceBadge = Steedos.getBadge null,Steedos.spaceId()
		currentSpaceBadge = if currentSpaceBadge then currentSpaceBadge else 0
		allSpaceBadge = Steedos.getBadge()
		allSpaceBadge = if allSpaceBadge then allSpaceBadge else 0
		return allSpaceBadge - currentSpaceBadge

Template.space_switcher.events

	"click .switchSpace": ->
		Steedos.setSpaceId(this._id)
		# 获取路由路径中第一个单词，即根目录
		rootName = FlowRouter.current().path.split("/")[1]
		FlowRouter.go("/#{rootName}")

