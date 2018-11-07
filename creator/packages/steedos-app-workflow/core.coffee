@Workflow = {}
Workflow.openFlowDesign = (locale, space, flow)->
	url = "/packages/steedos_admin/assets/designer/index.html?locale=#{locale}&space=#{space}"
	if flow
		url = url + "&flow=#{flow}"
	Steedos.openWindow Steedos.absoluteUrl(url)
