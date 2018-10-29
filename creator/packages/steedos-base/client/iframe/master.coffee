Template.iframeLayout.helpers 
	
	subsReady: ->
		return Steedos.subsBootstrap.ready()


Template.iframeLayout.events

Template.iframeLayout.onCreated ()->

Template.iframeLayout.onRendered ()->
	# 去除客户端右击事件
	Steedos.forbidNodeContextmenu window, "#main_iframe"

