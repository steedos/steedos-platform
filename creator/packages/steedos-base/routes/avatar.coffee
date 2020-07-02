Meteor.startup ->
	
	JsonRoutes.add 'get', '/avatar/:userId', (req, res, next) ->
		# this.params =
		# 	userId: decodeURI(req.url).replace(/^\//, '').replace(/\?.*$/, '')
		width = 50 ;
		height = 50 ;
		fontSize = 28 ;
		if req.query.w
		    width = req.query.w ;
		if req.query.h
		    height = req.query.h ;
		if req.query.fs
            fontSize = req.query.fs ;

		user = db.users.findOne(req.params.userId);
		if !user
			res.writeHead 401
			res.end()
			return

		if user.avatar
			res.setHeader "Location", Steedos.absoluteUrl("api/files/avatars/" + user.avatar)
			res.writeHead 302
			res.end()
			return

		if user.profile?.avatar
			res.setHeader "Location", user.profile.avatar
			res.writeHead 302
			res.end()
			return

		if user.avatarUrl
			res.setHeader "Location", user.avatarUrl
			res.writeHead 302
			res.end()
			return

		if not file?
			res.setHeader 'Content-Disposition', 'inline'
			res.setHeader 'content-type', 'image/svg+xml'
			res.setHeader 'cache-control', 'public, max-age=31536000'
			svg = """
				<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
					 viewBox="0 0 72 72" style="enable-background:new 0 0 72 72;" xml:space="preserve">
				<style type="text/css">
					.st0{fill:#FFFFFF;}
					.st1{fill:#D0D0D0;}
				</style>
				<g>
					<path class="st0" d="M36,71.1c-19.3,0-35-15.7-35-35s15.7-35,35-35s35,15.7,35,35S55.3,71.1,36,71.1z"/>
					<path class="st1" d="M36,2.1c18.7,0,34,15.3,34,34s-15.3,34-34,34S2,54.8,2,36.1S17.3,2.1,36,2.1 M36,0.1c-19.9,0-36,16.1-36,36
						s16.1,36,36,36s36-16.1,36-36S55.9,0.1,36,0.1L36,0.1z"/>
				</g>
				<g>
					<g>
						<path class="st1" d="M35.8,42.6c8.3,0,15.1-6.8,15.1-15.1c0-8.3-6.8-15.1-15.1-15.1c-8.3,0-15.1,6.8-15.1,15.1
							C20.7,35.8,27.5,42.6,35.8,42.6z"/>
						<path class="st1" d="M36.2,70.7c8.7,0,16.7-3.1,22.9-8.2c-3.6-9.6-12.7-15.5-23.3-15.5c-10.4,0-19.4,5.7-23.1,15
							C19,67.4,27.2,70.7,36.2,70.7z"/>
					</g>
				</g>
				</svg>
			"""
			res.write svg
#			res.setHeader "Location", Steedos.absoluteUrl("/packages/steedos_base/client/images/default-avatar.png")
#			res.writeHead 302
			res.end()
			return

		username = user.name;
		if !username
			username = ""

		res.setHeader 'Content-Disposition', 'inline'

		if not file?
			res.setHeader 'content-type', 'image/svg+xml'
			res.setHeader 'cache-control', 'public, max-age=31536000'

			colors = ['#F44336','#E91E63','#9C27B0','#673AB7','#3F51B5','#2196F3','#03A9F4','#00BCD4','#009688','#4CAF50','#8BC34A','#CDDC39','#FFC107','#FF9800','#FF5722','#795548','#9E9E9E','#607D8B']

			username_array = Array.from(username)
			color_index = 0
			_.each username_array, (item) ->
				color_index += item.charCodeAt(0);

			position = color_index % colors.length
			color = colors[position]
			#color = "#D6DADC"

			initials = ''
			if username.charCodeAt(0)>255
				initials = username.substr(0, 1)
			else
				initials = username.substr(0, 2)

			initials = initials.toUpperCase()

			svg = """
			<?xml version="1.0" encoding="UTF-8" standalone="no"?>
			<svg xmlns="http://www.w3.org/2000/svg" pointer-events="none" width="#{width}" height="#{height}" style="width: #{width}px; height: #{height}px; background-color: #{color};">
				<text text-anchor="middle" y="50%" x="50%" dy="0.36em" pointer-events="auto" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, Helvetica, Arial, Microsoft Yahei, SimHei" style="font-weight: 400; font-size: #{fontSize}px;">
					#{initials}
				</text>
			</svg>
			"""

			res.write svg
			res.end()
			return

		reqModifiedHeader = req.headers["if-modified-since"];
		if reqModifiedHeader?
			if reqModifiedHeader == user.modified?.toUTCString()
				res.setHeader 'Last-Modified', reqModifiedHeader
				res.writeHead 304
				res.end()
				return

		res.setHeader 'Last-Modified', user.modified?.toUTCString() or new Date().toUTCString()
		res.setHeader 'content-type', 'image/jpeg'
		res.setHeader 'Content-Length', file.length

		file.readStream.pipe res
		return