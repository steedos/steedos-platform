URL = require('url')
REQUEST = require('request')


Meteor.startup ->
    
    ProxyJS =
        max_request_length: 100000
        proxy_request_timeout_ms: 10000
        enable_logging: true

        addCORSHeaders: (req, res)->
            if req.method.toUpperCase() == 'OPTIONS'
                if req.headers['access-control-request-headers']
                    res.setHeader 'Access-Control-Allow-Headers', req.headers['access-control-request-headers']
                if req.headers['access-control-request-method']
                    res.setHeader 'Access-Control-Allow-Methods', req.headers['access-control-request-method']

            if req.headers['origin']
                res.setHeader 'Access-Control-Allow-Origin', req.headers['origin']
            else
                res.setHeader 'Access-Control-Allow-Origin', '*'
        
        writeResponse: (res, httpCode, body)->
            res.statusCode = httpCode;
            res.end(body);
            
        sendInvalidURLResponse: (res)->
            return @writeResponse(res, 404, "url must be in the format of ?fetch={some_url_here}");
            
        sendTooBigResponse: (res)->
            return @writeResponse(res, 413, "the content in the request or response cannot exceed " + @max_request_length + " characters.");
            
        getClientAddress: (req)->
            return (req.headers['x-forwarded-for'] or '').split(',')[0] or req.connection.remoteAddress

        processRequest: (req, res)->
            @addCORSHeaders req, res
            # Return options pre-flight requests right away
            if req.method.toUpperCase() == 'OPTIONS'
                return @writeResponse(res, 204)

            remoteURL = URL.parse req.query.fetch

            # We don't support relative links
            if !remoteURL.host
                return @writeResponse(res, 404, 'relative URLS are not supported')
            # We only support http and https
            if remoteURL.protocol != 'http:' and remoteURL.protocol != 'https:'
                return @writeResponse(res, 400, 'only http and https are supported')

            # Make sure the host header is to the URL we're requesting, not thingproxy
            if req.headers['host']
                req.headers['host'] = remoteURL.host

            console.log "url:#{remoteURL}"
            console.log "headers:#{JSON.stringify(req.headers)}"
            console.log "method:#{req.method}"
            proxyRequest = REQUEST(
                url: remoteURL
                headers: req.headers
                method: req.method
                timeout: @proxy_request_timeout_ms
                strictSSL: false)
            proxyRequest.on 'error', (err) ->
                if err.code == 'ENOTFOUND'
                    @writeResponse res, 502, 'host cannot be found.'
                else
                    console.log 'Proxy Request Error: ' + err.toString()
                    @writeResponse res, 500


            requestSize = 0
            proxyResponseSize = 0
            req.pipe(proxyRequest).on 'data', (data) ->
                requestSize += data.length
                if requestSize >= ProxyJS.max_request_length
                    proxyRequest.end()
                    return sendTooBigResponse(res)
                return
            proxyRequest.pipe(res).on 'data', (data) ->
                proxyResponseSize += data.length
                if proxyResponseSize >= ProxyJS.max_request_length
                    proxyRequest.end()
                    return sendTooBigResponse(res)
                return


    JsonRoutes.add 'get', '/api/proxy/', (req, res, next) ->

        unless req.query and req.query.fetch
            ProxyJS.sendInvalidURLResponse res

        # Log our request
        if ProxyJS.enable_logging
            console.log 'fetching proxy from steedos-api: %s %s %s', (new Date).toJSON(), req.method, req.url

        ProxyJS.processRequest req, res


