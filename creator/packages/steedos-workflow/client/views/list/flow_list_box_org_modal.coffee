Template.flow_list_box_org_modal.helpers
    contactsTreeData: ()->
        return Template.instance().data
    subsReady: ->
        return Steedos.subsSpace.ready();
    flowListData: ()->
        return Template.instance().data
    title: ()->
        title = Template.instance().data?.title
        if title
            return title
        else
            return t "Fill in form"
	
	clearable: ->
		return Template.instance().data?.clearable


Template.flow_list_box_org_modal.events
	'click #remove': (event, template) ->
		Modal.hide('flow_list_box_org_modal');
		if template.data?.callBack && _.isFunction(template.data.callBack)
			template.data.callBack flow:null, organization: null
		if Steedos.isMobile()
			# 手机上可能菜单展开了，需要额外收起来
			$("body").removeClass("sidebar-open")



Template.flow_list_box_org_modal.onRendered ->
