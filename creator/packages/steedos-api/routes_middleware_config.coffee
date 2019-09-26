

JsonRoutes.Middleware.use('/steedos/api/space_users', JsonRoutes.Middleware.authenticateMeteorUserByAccessToken);
JsonRoutes.Middleware.use('/steedos/api/space_users', JsonRoutes.Middleware.authenticateMeteorUserByAuthToken);
