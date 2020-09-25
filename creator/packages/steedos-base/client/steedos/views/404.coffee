Template.not_found.helpers
	notFoundPath: ()->
		return Creator.getRelativeUrl("/assets/images/illustrations/empty-state-no-results.svg#no-results")

	notFoundHeading: ()->
		return t "steedos_i18n_404_not_found"

Template.not_found.onRendered ->
	# 在iframe打开的404窗口的时候，禁掉右键菜单
	Steedos.forbidNodeContextmenu(window)