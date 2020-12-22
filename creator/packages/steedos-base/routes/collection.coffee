Cookies = require("cookies")
steedosAuth = require("@steedos/auth")

JsonRoutes.add "post", "/api/collection/find", (req, res, next) ->
    try
        cookies = new Cookies( req, res )
        authToken = req.body["X-Auth-Token"] || cookies.get("X-Auth-Token")

        if !authToken
            JsonRoutes.sendResult res,
            code: 401,
            data:
                "error": "Validate Request -- Missing X-Auth-Token",
                "instance": "1329598861",
                "success": false
            return

        model = req.body.model
        selector = req.body.selector
        options = req.body.options
        space = req.body.space
        data = []
        allow_models = ['space_users', 'organizations', 'flow_roles', 'roles']

        if !space
            JsonRoutes.sendResult res,
            code: 403,
            data:
                "error": "invalid space " + space,
                "success": false
            return

        # 用户登录验证
        check(space, String)
        check(authToken, String)
        userSession = Meteor.wrapAsync((authToken, spaceId, cb) ->
            steedosAuth.getSession(authToken, spaceId).then (resolve, reject) ->
                cb(reject, resolve)
            )(authToken, space)
        unless userSession
            JsonRoutes.sendResult res,
                code: 500,
                data:
                    "error": "auth failed",
                    "success": false
            return
        userId = userSession.userId

        if !allow_models.includes(model)
            JsonRoutes.sendResult res,
            code: 403,
            data:
                "error": "invalid model " + model,
                "success": false
            return

        if !db[model]
            JsonRoutes.sendResult res,
            code: 403,
            data:
                "error": "invalid model " + model,
                "success": false
            return

        if !selector
            selector = {}

        if !options
            options = {}

        selector.space = space

        data = db[model].find(selector, options).fetch()

        JsonRoutes.sendResult res,
            code: 200,
            data: data
    catch e
        console.error e.stack
        JsonRoutes.sendResult res,
            code: 200,
            data: []


JsonRoutes.add "post", "/api/collection/findone", (req, res, next) ->
    try
        cookies = new Cookies( req, res )
        authToken = req.body["X-Auth-Token"] || cookies.get("X-Auth-Token")

        if !authToken
            JsonRoutes.sendResult res,
            code: 401,
            data:
                "error": "Validate Request -- Missing X-Auth-Token",
                "instance": "1329598861",
                "success": false
            return

        model = req.body.model
        selector = req.body.selector
        options = req.body.options
        space = req.body.space
        data = []
        allow_models = ['space_users', 'organizations', 'flow_roles', 'mail_accounts', 'roles']

        if !space
            JsonRoutes.sendResult res,
            code: 403,
            data:
                "error": "invalid space " + space,
                "success": false
            return

        # 用户登录验证
        check(space, String)
        check(authToken, String)
        userSession = Meteor.wrapAsync((authToken, spaceId, cb) ->
            steedosAuth.getSession(authToken, spaceId).then (resolve, reject) ->
                cb(reject, resolve)
            )(authToken, space)
        unless userSession
            JsonRoutes.sendResult res,
                code: 500,
                data:
                    "error": "auth failed",
                    "success": false
            return
        userId = userSession.userId

        if !allow_models.includes(model)
            JsonRoutes.sendResult res,
            code: 403,
            data:
                "error": "invalid model " + model,
                "success": false
            return

        if !db[model]
            JsonRoutes.sendResult res,
            code: 403,
            data:
                "error": "invalid model " + model,
                "success": false
            return

        if !selector
            selector = {}

        if !options
            options = {}

        if model == 'mail_accounts'
            selector = {}
            selector.owner = userId
            data = db[model].findOne(selector)
        else
            selector.space = space

            data = db[model].findOne(selector, options)

        JsonRoutes.sendResult res,
            code: 200,
            data: data
    catch e
        console.error e.stack
        JsonRoutes.sendResult res,
            code: 200,
            data: {}
