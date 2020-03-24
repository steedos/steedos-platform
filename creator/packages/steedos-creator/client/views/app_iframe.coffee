Template.creator_app_iframe.helpers
	subsReady: ->
		return Steedos.subsBootstrap.ready()
	url: ->
		app_id = Session.get("app_id")
		app = Creator.getApp(app_id)
		# 有脚本时不把url设置到iframe的src属性中，由脚本自动变更，这样可以处理单点登录问题
		if app and !app.on_click and app.url
			return app.url
		else
			return ""

Template.creator_app_iframe.events

Template.creator_app_iframe.onCreated ->

Template.creator_app_iframe.onRendered ->
	# 去除客户端右击事件
	Steedos.forbidNodeContextmenu window, "#app_iframe"

	# 如果app有on_click脚本，则执行
	app_id = Session.get("app_id")
	app = Creator.getApp(app_id)
	iframe = $("#app_iframe")
	if app and app.on_click
		###
			这里执行的是一个不带参数的闭包函数，用来避免变量污染
			on_click脚本中可以直接调用变量app_id、app、iframe等上面字义过的变量
			一般来说脚本会是这样的：var url = ...; iframe.attr("src", url)
			注意每次变更on_click脚本内容后，目标浏览器或客户端都需要刷新才能生效
		###

		evalFunString = '(function(){' + app.on_click + '})()'
		try
			eval evalFunString
		catch e
			###just console the error when catch error###
			console.error 'catch some error when eval the on_click script for app link:'
			console.error e.message + '\u000d\n' + e.stack

Template.creator_app_iframe.onDestroyed ->

