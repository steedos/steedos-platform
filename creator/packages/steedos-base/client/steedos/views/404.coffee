Template.not_found.helpers
	iconUrl: ->
		return Steedos.absoluteUrl("/packages/steedos_theme/client/images/icon.png")

	isShowInfo: ->
		return Steedos.isMobile() or Steedos.isAndroidOrIOS()


Template.not_found.onRendered ->
	# 在iframe打开的404窗口的时候，禁掉右键菜单
	Steedos.forbidNodeContextmenu(window)