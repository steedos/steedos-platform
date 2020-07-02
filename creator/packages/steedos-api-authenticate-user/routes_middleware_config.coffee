JsonRoutes.Middleware.use('/api', JsonRoutes.Middleware.authenticateMeteorUser);

JsonRoutes.Middleware.use('/steedos/api/space_users', JsonRoutes.Middleware.authenticateMeteorUser);

JsonRoutes.Middleware.use('/tableau/api', JsonRoutes.Middleware.authenticateMeteorUser);
JsonRoutes.Middleware.use('/tableau/search', JsonRoutes.Middleware.authenticateMeteorUser);

