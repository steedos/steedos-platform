@Favorites = {};

getActionSelected = (params)->
	object_name = params.object_name || Session.get("object_name")
	if params.list_view_id && !_.has(params, 'record_id')
		if Creator.getCollection("favorites").findOne({object_name: object_name, record_type: 'LIST_VIEW', record_id: params.list_view_id})
			return true
	else if params.record_id
		if Creator.getCollection("favorites").findOne({object_name: object_name, record_type: 'RECORD', record_id: params.record_id})
			return true
	return false;

getActionDisabled = (params)->
	if params.list_view_id && !_.has(params, 'record_id')
		return false
	else if params.record_id
		return false
	return true

getAssistiveText = (actionDisabled, actionSelected)->
	assistiveText = {action: '',more: '收藏夹列表'}
	if actionDisabled
		assistiveText.action = '此项目不支持收藏夹'
	else
		if actionSelected
			assistiveText.action = '删除收藏夹'
		else
			assistiveText.action = '添加收藏夹'
	return assistiveText

Favorites.changeRecords = ()->
	SteedosReact = require('@steedos/react');
	store.dispatch(SteedosReact.changeRecords(Creator.getCollection("favorites").find({space: Session.get("spaceId"), owner: Meteor.userId()}, {sort: {sort_no: -1}}).fetch(), 'steedos-header-favorites'))

Favorites.changeState = ()->
	SteedosReact = require('@steedos/react');
	currentRouter = FlowRouter.current();
	params = currentRouter?.params
	object_name = params.object_name || Session.get("object_name")
	if object_name
		actionDisabled = getActionDisabled(params);
		actionSelected = getActionSelected(params);
		store.dispatch(SteedosReact.changeActionSelected(actionSelected, 'steedos-header-favorites'))
		store.dispatch(SteedosReact.changeActionDisabled(actionDisabled, 'steedos-header-favorites'))
		store.dispatch(SteedosReact.changeAssistiveText(getAssistiveText(actionDisabled, actionSelected), 'steedos-header-favorites'))

Meteor.startup ()->
	Meteor.autorun ()->
		if Creator.subs["CreatorFavorites"].ready("myFavorites") && Creator.bootstrapLoaded.get()
			Favorites.changeRecords();
			Favorites.changeState();


