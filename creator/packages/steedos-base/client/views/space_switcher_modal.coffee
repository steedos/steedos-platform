Template.space_switcher_modal.helpers

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

	maxHeight: ->
		return Template.instance()?.maxHeight.get() - 165 + 'px'

	isSeleted: (_id)->
		return _id == Session.get("spaceId")

Template.space_switcher_modal.onCreated ->
	self = this;

	self.maxHeight = new ReactiveVar(
		$(window).height());

	$(window).resize ->
		self.maxHeight?.set($(window).height());

Template.space_switcher_modal.events
	"click .switchSpace": (event, template)->
		Steedos.setSpaceId(this._id)
		# 获取路由路径中第一个单词，即根目录
		rootName = FlowRouter.current().path.split("/")[1]
		FlowRouter.go("/#{rootName}")

		Modal.hide(template)

