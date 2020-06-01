DesignerAPI =

	getAbsoluteUrl: (url)->
		rootUrl = if __meteor_runtime_config__ then __meteor_runtime_config__.ROOT_URL_PATH_PREFIX else ""
		if rootUrl
			url = rootUrl + url
		return url;

	writeResponse: (res, httpCode, body)->
		res.statusCode = httpCode;
		res.end(body);
		
	sendInvalidURLResponse: (res)->
		return @writeResponse(res, 404, "the param 'url' is required as querys.");
		
	sendAuthTokenExpiredResponse: (res)->
		return @writeResponse(res, 401, "the auth_token has expired.");

	sendHtmlResponse: (req, res, type)->
		query = req.query
		url = query.url

		if url
			url = decodeURIComponent(url)
		else
			DesignerAPI.sendInvalidURLResponse res
		
		title = query.title
		if title
			title = decodeURIComponent(title)
		else
			title = "Steedos Designer"
		
		error_msg = ""

		return @writeResponse res, 200, """
			<html>
				<head>
					<style>
						html,body{
							margin: 0;
							padding: 0;
							height: 100%;
						}
						body { 
							font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
							text-align: center;
							background-color: #fff;
						}
						.loading{
							position: absolute;
							left: 0px;
							right: 0px;
							top: 50%;
							z-index: -1;/*设置为-1，可以在iframe加载出来后自动消失*/
							text-align: center;
							margin-top: -30px;
							font-size: 36px;
							color: #dfdfdf;
						}
						.error-msg{
							position: absolute;
							left: 0px;
							right: 0px;
							bottom: 20px;
							z-index: 1100;
							text-align: center;
							font-size: 20px;
							color: #a94442;
						}
					</style>
					<meta charset="utf-8">
					<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
					<title>#{title}</title>
					<link rel="icon" type="image/png" sizes="192x192" href="#{@getAbsoluteUrl("/favicons/android-chrome-192x192.png")}">
					<link rel="manifest" href="#{@getAbsoluteUrl("/favicons/manifest.json")}">
					<meta name="mobile-web-app-capable" content="yes">
					<meta name="theme-color" content="#000">
					<meta name="application-name">
					<link rel="apple-touch-icon" sizes="57x57" href="#{@getAbsoluteUrl("/favicons/apple-touch-icon-57x57.png")}">
					<link rel="apple-touch-icon" sizes="60x60" href="#{@getAbsoluteUrl("/favicons/apple-touch-icon-60x60.png")}">
					<link rel="apple-touch-icon" sizes="72x72" href="#{@getAbsoluteUrl("/favicons/apple-touch-icon-72x72.png")}">
					<link rel="apple-touch-icon" sizes="76x76" href="#{@getAbsoluteUrl("/favicons/apple-touch-icon-76x76.png")}">
					<link rel="apple-touch-icon" sizes="114x114" href="#{@getAbsoluteUrl("/favicons/apple-touch-icon-114x114.png")}">
					<link rel="apple-touch-icon" sizes="120x120" href="#{@getAbsoluteUrl("/favicons/apple-touch-icon-120x120.png")}">
					<link rel="apple-touch-icon" sizes="144x144" href="#{@getAbsoluteUrl("/favicons/apple-touch-icon-144x144.png")}">
					<link rel="apple-touch-icon" sizes="152x152" href="#{@getAbsoluteUrl("/favicons/apple-touch-icon-152x152.png")}">
					<link rel="apple-touch-icon" sizes="180x180" href="#{@getAbsoluteUrl("/favicons/apple-touch-icon-180x180.png")}">
					<meta name="apple-mobile-web-app-capable" content="yes">
					<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
					<meta name="apple-mobile-web-app-title">
					<link rel="icon" type="image/png" sizes="228x228" href="#{@getAbsoluteUrl("/favicons/coast-228x228.png")}">
					<link rel="icon" type="image/png" sizes="16x16" href="#{@getAbsoluteUrl("/favicons/favicon-16x16.png")}">
					<link rel="icon" type="image/png" sizes="32x32" href="#{@getAbsoluteUrl("/favicons/favicon-32x32.png")}">
					<link rel="icon" type="image/png" sizes="96x96" href="#{@getAbsoluteUrl("/favicons/favicon-96x96.png")}">
					<link rel="icon" type="image/png" sizes="230x230" href="#{@getAbsoluteUrl("/favicons/favicon-230x230.png")}">
					<link rel="shortcut icon" href="#{@getAbsoluteUrl("/favicons/favicon.ico")}">
					<link rel="yandex-tableau-widget" href="#{@getAbsoluteUrl("/favicons/yandex-browser-manifest.json")}">
					<meta name="msapplication-TileColor" content="#fff">
					<meta name="msapplication-TileImage" content="#{@getAbsoluteUrl("/favicons/mstile-144x144.png")}">
					<meta name="msapplication-config" content="#{@getAbsoluteUrl("/favicons/browserconfig.xml")}">
					<meta property="twitter:image" content="#{@getAbsoluteUrl("/favicons/twitter.png")}">
					<meta property="og:image" content="#{@getAbsoluteUrl("/favicons/open-graph.png")}">
				</head>
				<body>
					<div class = "loading">Loading...</div>
					<div class = "error-msg">#{error_msg}</div>
					<iframe id="ifrDesigner" src="" width="100%" height="100%" nwdisable="true" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes"></iframe>
					<script type="text/javascript" src="#{@getAbsoluteUrl("/lib/jquery/jquery-1.11.2.min.js")}"></script>
					<script type="text/javascript">
						var designer = {
							urlQuery:function(name){
								var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
								var r = window.location.search.substr(1).match(reg);
								if (r != null) return unescape(r[2]);
								return null;
							},
							run:function(){
								var url = this.urlQuery("url");
								url = decodeURIComponent(url);
								
								if(url){
									$("#ifrDesigner").attr("src",url);
								}
								var Steedos = window.opener.Steedos || null;
								if (Steedos) {
									Steedos.forbidNodeContextmenu(window);
								}
							}
						};
						$(function(){
							designer.run();
						});
					</script>
				<body>
			</html>
		"""

JsonRoutes.add 'get', '/api/workflow/designer?url=:url', (req, res, next) ->
	DesignerAPI.sendHtmlResponse req, res

