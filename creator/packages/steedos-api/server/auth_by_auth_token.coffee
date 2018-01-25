Fiber = Npm.require('fibers');

JsonRoutes.Middleware.authenticateMeteorUserByAuthToken = (req, res, next)->

	Fiber(()->
		if !req.userId
			userId = Steedos.getUserIdFromAuthToken(req, res);

			if userId
				req.userId = userId;
		next();
	).run()
