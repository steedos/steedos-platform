Meteor.startup ->
    
    JsonRoutes.add 'get', '/avatar/cms_sites/:siteId', (req, res, next) ->
        site = db.cms_sites.findOne(req.params.siteId);
        if !site
            res.writeHead 401
            res.end()
            return

        if site.avatar
            res.setHeader "Location", Meteor.absoluteUrl("api/files/avatars/" + site.avatar)
            res.writeHead 302
            res.end()
            return

        username = site.name;
        if !username
            username = ""

        res.setHeader 'Content-Disposition', 'inline'

        if not file?
            res.setHeader 'content-type', 'image/svg+xml'
            res.setHeader 'cache-control', 'public, max-age=31536000'

            colors = ['#F44336','#E91E63','#9C27B0','#673AB7','#3F51B5','#2196F3','#03A9F4','#00BCD4','#009688','#4CAF50','#8BC34A','#CDDC39','#FFC107','#FF9800','#FF5722','#795548','#9E9E9E','#607D8B']

            position = username.length % colors.length
            color = colors[position]

            initials = ''
            if username.charCodeAt(0)>255
                initials = username.substr(0, 1)
            else
                initials = username.substr(0, 2)

            initials = initials.toUpperCase()

            svg = """
            <?xml version="1.0" encoding="UTF-8" standalone="no"?>
            <svg xmlns="http://www.w3.org/2000/svg" pointer-events="none" width="50" height="50" style="width: 50px; height: 50px; background-color: #{color};">
                <text text-anchor="middle" y="50%" x="50%" dy="0.36em" pointer-events="auto" fill="#ffffff" font-family="Helvetica, Arial, Lucida Grande, sans-serif" style="font-weight: 400; font-size: 28px;">
                    #{initials}
                </text>
            </svg>
            """

            res.write svg
            res.end()
            return

        reqModifiedHeader = req.headers["if-modified-since"];
        if reqModifiedHeader?
            if reqModifiedHeader == site.modified?.toUTCString()
                res.setHeader 'Last-Modified', reqModifiedHeader
                res.writeHead 304
                res.end()
                return

        res.setHeader 'Last-Modified', site.modified?.toUTCString() or new Date().toUTCString()
        res.setHeader 'content-type', 'image/jpeg'
        res.setHeader 'Content-Length', file.length

        file.readStream.pipe res
        return