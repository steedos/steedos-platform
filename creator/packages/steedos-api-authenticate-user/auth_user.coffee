Fiber = require('fibers');

JsonRoutes.Middleware.authenticateMeteorUser = (req, res, next)->

	Fiber(()->
		if !req.userId
			userId = Steedos.getUserIdFromAccessToken(req.query?.access_token);

			if not userId
				userId = Steedos.getUserIdFromAuthToken(req, res);

			if userId
				req.userId = userId;

		next();
	).run()