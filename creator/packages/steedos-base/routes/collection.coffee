Cookies = Npm.require("cookies")

JsonRoutes.add "post", "/api/collection/find", (req, res, next) ->
    try
        # TODO 用户登录验证
        cookies = new Cookies( req, res );

        # first check request body
        if req.body
            userId = req.body["X-User-Id"]
            authToken = req.body["X-Auth-Token"]

        # then check cookie
        if !userId or !authToken
            userId = cookies.get("X-User-Id")
            authToken = cookies.get("X-Auth-Token")

        if !(userId and authToken)
            JsonRoutes.sendResult res, 
            code: 401,
            data: 
                "error": "Validate Request -- Missing X-Auth-Token", 
                "instance": "1329598861", 
                "success": false
            return;

        model = req.body.model;
        selector = req.body.selector;
        options = req.body.options;
        space = req.body.space;
        data = [];
        allow_models = ['space_users', 'organizations', 'flow_roles']

        if !space
            JsonRoutes.sendResult res, 
            code: 403,
            data: 
                "error": "invalid space " + space, 
                "success": false
            return;

        # TODO 用户是否属于space
        space_user = db.space_users.findOne({user: userId, space: space})
        
        if !space_user
            JsonRoutes.sendResult res, 
            code: 403,
            data: 
                "error": "invalid space " + space, 
                "success": false
            return;

        if !allow_models.includes(model)
            JsonRoutes.sendResult res, 
            code: 403,
            data: 
                "error": "invalid model " + model, 
                "success": false
            return;

        if !db[model]
            JsonRoutes.sendResult res, 
            code: 403,
            data: 
                "error": "invalid model " + model, 
                "success": false
            return;

        if !selector
            selector = {};

        if !options
            options = {};

        selector.space = space

        data = db[model].find(selector, options).fetch();

        JsonRoutes.sendResult res, 
            code: 200,
            data: data;
    catch e
        console.error e.stack
        JsonRoutes.sendResult res, 
            code: 200,
            data: [];


JsonRoutes.add "post", "/api/collection/findone", (req, res, next) ->
    try
        # TODO 用户登录验证
        cookies = new Cookies( req, res );

        # first check request body
        if req.body
            userId = req.body["X-User-Id"]
            authToken = req.body["X-Auth-Token"]

        # then check cookie
        if !userId or !authToken
            userId = cookies.get("X-User-Id")
            authToken = cookies.get("X-Auth-Token")

        if !(userId and authToken)
            JsonRoutes.sendResult res, 
            code: 401,
            data: 
                "error": "Validate Request -- Missing X-Auth-Token", 
                "instance": "1329598861", 
                "success": false
            return;

        model = req.body.model;
        selector = req.body.selector;
        options = req.body.options;
        space = req.body.space;
        data = [];
        allow_models = ['space_users', 'organizations', 'flow_roles', 'mail_accounts']

        if !space
            JsonRoutes.sendResult res, 
            code: 403,
            data: 
                "error": "invalid space " + space, 
                "success": false
            return;

        # TODO 用户是否属于space
        space_user = db.space_users.findOne({user: userId, space: space})
        
        if !space_user
            JsonRoutes.sendResult res, 
            code: 403,
            data: 
                "error": "invalid space " + space, 
                "success": false
            return;

        if !allow_models.includes(model)
            JsonRoutes.sendResult res, 
            code: 403,
            data: 
                "error": "invalid model " + model, 
                "success": false
            return;

        if !db[model]
            JsonRoutes.sendResult res, 
            code: 403,
            data: 
                "error": "invalid model " + model, 
                "success": false
            return;

        if !selector
            selector = {};

        if !options
            options = {};

        if model == 'mail_accounts'
            selector = {};
            selector.owner = userId
            data = db[model].findOne(selector);
        else
            selector.space = space
        
            data = db[model].findOne(selector, options);

        JsonRoutes.sendResult res, 
            code: 200,
            data: data;
    catch e
        console.error e.stack
        JsonRoutes.sendResult res, 
            code: 200,
            data: {}