Template.flow_list_box.helpers
	flow_list_data: ->
		showType = Template.instance().data?.showType
		return WorkflowManager.getFlowListData(showType);

	empty: (categorie)->
		if !categorie.forms || categorie.forms.length < 1
			return false;
		return true;

	equals: (a, b)->
		return a == b;

	is_start_flow: (flowId)->
		start_flows = db.steedos_keyvalues.findOne({space: Session.get("spaceId"), user: Meteor.userId(), key: 'start_flows'})?.value || []

		return start_flows.includes(flowId)

	start_flows: ()->
		showType = Template.instance().data?.showType
		listData = WorkflowManager.getFlowListData(showType)
		if listData.distribute_optional_flows
			# 分发时不显示星标流程
			return []
		else
			# 把流程分类的数据结构转成流程id值列表
			all_flows = _.pluck(_.flatten(_.pluck(_.flatten(_.pluck(listData.categories,"forms"), true),"flows"),true),"_id")
			unless all_flows?.length
				return []
		start_flows = db.steedos_keyvalues.findOne({space: Session.get("spaceId"), user: Meteor.userId(), key: 'start_flows'})?.value || []
		flows = db.flows.find({_id: {$in: _.intersection(start_flows, all_flows)}}).fetch()
		return flows

	show_start_flows: (start_flows)->
		if start_flows?.length > 0
			return true
		return false;
	
	subtitle: ->
		return Template.instance().data?.subTitle
	
	clearable: ->
		return Template.instance().data?.clearable
		
	isCategorieChecked: (id)->
		if Template.instance().data?.categorie == id
			return true
		return false; 

	isFlowChecked: (id)->
		if Template.instance().data?.flow == id
			return true
		return false; 

Template.flow_list_box.events
	'click .flow_list_box .weui-cell__bd': (event, template) ->
		flow = event.currentTarget.dataset.flow
		clearable = template.data?.clearable
		if !flow and !clearable
			return;
		Modal.hide('flow_list_box_modal');
		categorie = $(event.currentTarget).closest(".collapse").data("categorie")
		if template.data?.callBack && _.isFunction(template.data.callBack)
			template.data.callBack flow:flow, categorie: categorie
		if Steedos.isMobile()
			# 手机上可能菜单展开了，需要额外收起来
			$("body").removeClass("sidebar-open")

	'click .flow_list_box .weui-cell__ft': (event, template) ->

		start = false
		if event.currentTarget.dataset.start
			start = true

		Meteor.call 'start_flow', Session.get("spaceId"), this._id, !start