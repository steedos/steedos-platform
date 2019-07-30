var server = require('@steedos/meteor-bundle-runner');
server.Fiber(function () {
	server.Profile.run("Server startup", async function () {
		server.loadServerBundles();
		server.callStartupHooks();
		try {

			objectql = require("@steedos/objectql")
			newObjects = {}
			objectsRolesPermission = {}
			_.each(Creator.Objects, function (obj, key) {
				if (/^[_a-zA-Z][_a-zA-Z0-9]*$/.test(key)) {
					newObjects[key] = obj
				}
				objectsRolesPermission[key] = obj.permission_set
			})

			steedosSchema = new objectql.SteedosSchema({
				datasources: {
					default: {
						driver: 'meteor-mongo',
						objects: newObjects,
						objectsRolesPermission: objectsRolesPermission
					}
				},
				getRoles: function (userId) {
					console.log('userId: ', userId)
					return ['admin']
				}
			})

		} catch (error) {
			console.log(error)
		}
		server.Fiber(function () {
			server.runMain();
		}).run()

	});
}).run();