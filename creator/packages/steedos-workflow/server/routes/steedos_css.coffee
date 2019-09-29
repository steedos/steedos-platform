
JsonRoutes.add "get", "/steedos-css", (req, res, next)->

	allCss = WebApp.getRefreshableAssets()

	allCssLink = ""

	allCss.forEach (css) ->
		cssHref = Meteor.absoluteUrl(css.url)
		allCssLink += "@import url(#{cssHref});"

	res.statusCode = 200
	res.end(allCssLink)