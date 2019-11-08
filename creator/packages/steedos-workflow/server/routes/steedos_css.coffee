
JsonRoutes.add "get", "/steedos-css", (req, res, next)->

	allCss = WebApp.getRefreshableAssets()

	allCssLink = ""

	allCss.forEach (css) ->
		if __meteor_runtime_config__.ROOT_URL_PATH_PREFIX
			rootUrl = __meteor_runtime_config__.ROOT_URL
			if rootUrl.endsWith("/")
				cssHref = rootUrl.replace(__meteor_runtime_config__.ROOT_URL_PATH_PREFIX + "/", "") + css.url
			else
				cssHref = rootUrl.replace(__meteor_runtime_config__.ROOT_URL_PATH_PREFIX, "") + css.url
		else
			cssHref = Meteor.absoluteUrl(css.url)
		allCssLink += "@import url(#{cssHref});"

	res.statusCode = 200
	res.end(allCssLink)