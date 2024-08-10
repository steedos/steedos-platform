# Adding CORS headers so we can use CDNs for static content
cors = require("cors");
parseOrigin = (originEnv) ->
    if originEnv is 'true'
        true
    else if originEnv is 'false'
        false
    else if /^\/.*\/$/.test(originEnv)
        new RegExp(originEnv.slice(1, -1)) # 去掉两边的斜杠
    else if originEnv.startsWith('[') && originEnv.endsWith(']')
        originsArray = JSON.parse(originEnv)
        originsArray.map (item) ->
            if typeof item is 'string'
                item
            else if /^\/.*\/$/.test(item)
                new RegExp(item.slice(1, -1))
            else
                throw new Error 'Invalid origin value in array'
    else if typeof originEnv is 'string'
        originEnv
    else
        throw new Error 'Invalid origin value'

originEnv = process.env.STEEDOS_CORS_ORIGIN
origin = true
try
    origin = parseOrigin(originEnv)
    console.log 'Parsed origin:', origin
catch error
    console.error 'Error parsing origin:', error.message


# Try to parse all request bodies as JSON
WebApp.rawConnectHandlers.use (req, res, next) ->
	if req._body
		return next()

	if req.headers['transfer-encoding'] is undefined and isNaN(req.headers['content-length'])
		return next()

	if req.headers['content-type'] not in ['', undefined]
		return next()

	buf = ''
	req.setEncoding('utf8')
	req.on 'data', (chunk) -> buf += chunk
	req.on 'end', ->
		if Steedos?.debugLevel? and Steedos.debugLevel is 'debug'
			console.log '[request]'.green, req.method, req.url, '\nheaders ->', req.headers, '\nbody ->', buf

		try
			req.body = JSON.parse(buf)
		catch err
			req.body = buf

		req._body = true
		next()

WebApp.rawConnectHandlers.use(cors({origin: origin, credentials: true}));

WebApp.rawConnectHandlers.use (req, res, next) ->
	#if /^\/(api|_timesync|sockjs|tap-i18n)(\/|$)/.test req.url
	method = req.method && req.method.toUpperCase && req.method.toUpperCase();

	# Block next handlers to override CORS with value http://meteor.local
	setHeader = res.setHeader
	res.setHeader = (key, val) ->
		if key.toLowerCase() is 'access-control-allow-origin' and val is 'http://meteor.local'
			return
		return setHeader.apply @, arguments

	return next()

# _staticFilesMiddleware = WebAppInternals.staticFilesMiddleware
# WebAppInternals._staticFilesMiddleware = (staticFiles, req, res, next) ->
# 	res.setHeader("Access-Control-Allow-Origin", "*")
# 	_staticFilesMiddleware(staticFiles, req, res, next)


