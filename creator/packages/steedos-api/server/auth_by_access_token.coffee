Fiber = Npm.require('fibers');

JsonRoutes.Middleware.authenticateMeteorUserByAccessToken = (req, res, next)->

	Fiber(()->
		if !req.userId
			userId = Steedos.getUserIdFromAccessToken(req.query?.access_token);

			if userId
				req.userId = userId;
		next();
	).run()
